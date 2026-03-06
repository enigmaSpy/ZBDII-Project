import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import {LoginPage} from "./pages/LoginPage"
import {DashboardPage} from "./pages/DashboardPage"
import {Layout} from "./components/Layout"
import { ProductsPage } from "./pages/ProductsPage"
import { WarehousesPage } from "./pages/WarehousesPage"
import { SuppliersPage } from "./pages/SuppliersPage"
import { WorkersPage } from "./pages/WorkersPage"
import { LogsPage } from "./pages/LogsPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/products" element={<ProductsPage />} /> 
          <Route path="/warehouses" element={<WarehousesPage />} /> 
          <Route path="/suppliers" element={<SuppliersPage />} /> 
          <Route path="/admin/workers" element={<WorkersPage />} />
          <Route path="/admin/logs" element={<LogsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}