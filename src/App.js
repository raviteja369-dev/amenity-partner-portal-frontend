import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { BrandProvider } from "@/context/BrandContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
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

              <Route
                path="/admin"
                element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}
              >
                <Route index element={<AdminDashboard />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="leads" element={<AdminLeads mode="leads" />} />
                <Route path="clients" element={<AdminLeads mode="clients" />} />
                <Route path="payments" element={<AdminLeads mode="payments" />} />
              </Route>

              <Route
                path="/partner"
                element={<ProtectedRoute role="partner"><PartnerLayout /></ProtectedRoute>}
              >
                <Route index element={<PartnerDashboard />} />
                <Route path="leads" element={<PartnerLeads filter="all" />} />
                <Route path="clients" element={<PartnerLeads filter="clients" />} />
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
