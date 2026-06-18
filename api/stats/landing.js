const { MongoClient } = require("mongodb");

const LANDING_BRANDS = new Set(["eduosa", "c-forgia", "facilo"]);

function dbNameFromUri(uri) {
  const match =
    uri?.match(/\.mongodb\.net\/([^/?]+)/i) ||
    uri?.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^/?]+)/i);
  return match?.[1] || "school-connect";
}

async function fetchLandingStats(db, brand) {
  const qPartners = { brand };
  const qLeads = { brand };

  const total_partners = await db.collection("partners").countDocuments(qPartners);
  const total_leads = await db.collection("leads").countDocuments(qLeads);
  const total_clients = await db.collection("leads").countDocuments({ ...qLeads, status: "client" });

  const paid = await db.collection("leads").aggregate([
    { $match: { ...qLeads, status: "client", payment_status: "paid" } },
    { $group: { _id: null, total: { $sum: "$deal_value" } } },
  ]).toArray();
  const total_revenue = paid.length ? Number(paid[0].total) : 0;

  const pendingAgg = await db.collection("leads").aggregate([
    { $match: { ...qLeads, status: "client", payment_status: "unpaid" } },
    { $group: { _id: null, total: { $sum: "$deal_value" } } },
  ]).toArray();
  const pending_revenue = pendingAgg.length ? Number(pendingAgg[0].total) : 0;

  const monthlyRaw = await db.collection("leads").aggregate([
    { $match: qLeads },
    { $project: { month: { $substr: ["$created_at", 0, 7] } } },
    { $group: { _id: "$month", leads: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]).toArray();

  const monthly = monthlyRaw.slice(-7).map((r) => ({ month: r._id, leads: r.leads }));
  const conversion_rate = total_leads ? Math.round((total_clients / total_leads) * 100) : 0;

  return {
    brand,
    kpis: {
      total_partners,
      total_leads,
      total_clients,
      total_revenue,
      pending_revenue,
      conversion_rate,
    },
    monthly,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const brand = String(req.query.brand || "").toLowerCase();
  if (!LANDING_BRANDS.has(brand)) {
    return res.status(400).json({ error: "Invalid brand. Use eduosa, c-forgia, or facilo." });
  }

  const uri = process.env.MONGO_URI || process.env.MONGO_URL;
  if (!uri) {
    return res.status(503).json({ error: "MONGO_URI is not configured on Vercel." });
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || dbNameFromUri(uri));
    const payload = await fetchLandingStats(db, brand);
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json(payload);
  } catch (err) {
    console.error("landing stats error:", err);
    return res.status(500).json({ error: "Failed to load landing stats" });
  } finally {
    await client.close();
  }
};
