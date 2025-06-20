import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAdminProtection } from "../hooks/useAdminProtection";

const AdminRoute = ({ children }) => {
  const { loading, error } = useAdminProtection();

  if (loading) return <div>Verificando permissões...</div>;

  if (error) return <Navigate to="/acesso-negado" replace />;

  return (
    <>
      <Sidebar />
      <main className="container">{children}</main>
    </>
  );
};

export default AdminRoute;
