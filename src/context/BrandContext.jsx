import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const BRANDS = {
  eduosa: {
    key: "eduosa",
    name: "Eduosa",
    label: "Eduosa Partner Portal",
    tagline: "Edu-tech distribution, deployed at the speed of schools.",
    accentHex: "#C4B5FD",
    short: "EDU",
  },
  "c-forgia": {
    key: "c-forgia",
    name: "C-Forgia",
    label: "C-Forgia Partner Portal",
    tagline: "Forging consultative B2B school partnerships.",
    accentHex: "#002FA7",
    short: "CFG",
  },
  facilo: {
    key: "facilo",
    name: "Facilo",
    label: "Facilo Partner Portal",
    tagline: "Facility services for India's modern campuses.",
    accentHex: "#00C853",
    short: "FCL",
  },
};

const PARENT = {
  name: "Amenity Forge",
  product: "Partner Portal",
  description: "One ledger for three verticals. Track partners, leads, conversions and payments across Eduosa, C-Forgia and Facilo.",
};

// Per-deployment configuration via frontend/.env:
//   REACT_APP_DEFAULT_BRAND = eduosa | c-forgia | facilo
//   REACT_APP_BRAND_LOCK    = "true"  → hides switcher, pins to one vertical
const ENV_DEFAULT = (process.env.REACT_APP_DEFAULT_BRAND || "").toLowerCase();
const ENV_LOCKED = String(process.env.REACT_APP_BRAND_LOCK || "").toLowerCase() === "true";

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const defaultBrand = BRANDS[ENV_DEFAULT] ? ENV_DEFAULT : "eduosa";
  const initial = ENV_LOCKED
    ? defaultBrand
    : (typeof window !== "undefined" && localStorage.getItem("pp_brand")) || defaultBrand;

  const [brandKey, setBrandKey] = useState(BRANDS[initial] ? initial : defaultBrand);

  useEffect(() => {
    document.documentElement.setAttribute("data-brand", brandKey);
    document.documentElement.classList.remove("dark");
    if (!ENV_LOCKED) localStorage.setItem("pp_brand", brandKey);
  }, [brandKey]);

  const value = useMemo(() => ({
    brandKey,
    brand: BRANDS[brandKey],
    setBrand: (k) => { if (!ENV_LOCKED && BRANDS[k]) setBrandKey(k); },
    brands: BRANDS,
    parent: PARENT,
    locked: ENV_LOCKED,
    defaultBrand,
  }), [brandKey, defaultBrand]);

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}
