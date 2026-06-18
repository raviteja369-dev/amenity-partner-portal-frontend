import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { BrandProvider } from "@/context/BrandContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPartners from "@/pages/admin/AdminPartners";
import AdminLeads from "@/pages/admin/AdminLeads";
import PartnerLayout from "@/pages/partner/PartnerLayout";
import PartnerDashboard from "@/pages/partner/PartnerDashboard";
import PartnerLeads from "@/pages/partner/PartnerLeads";

function App() {
  return (
    <div className="App">
      <BrandProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster position="top-right" richColors closeButton />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />

              {/* Admin: login is public; dashboard routes are protected */}
              <Route path="/admin">
                <Route path="login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="leads" element={<AdminLeads mode="leads" />} />
                  <Route path="clients" element={<AdminLeads mode="clients" />} />
                  <Route path="payments" element={<AdminLeads mode="payments" />} />
                </Route>
              </Route>

              {/* Partner: login is public; dashboard routes are protected */}
              <Route path="/partner">
                <Route path="login" element={<Login portal="partner" />} />
                <Route element={<ProtectedRoute role="partner"><PartnerLayout /></ProtectedRoute>}>
                  <Route index element={<PartnerDashboard />} />
                  <Route path="leads" element={<PartnerLeads filter="all" />} />
                  <Route path="clients" element={<PartnerLeads filter="clients" />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </BrandProvider>
    </div>
  );
}

export default App;
