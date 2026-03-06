import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import {LoginPage} from "./pages/LoginPage"
import {DashboardPage} from "./pages/DashboardPage"
import {Layout} from "./components/Layout"
import { ProductsPage } from "./pages/ProductsPage"
import { WarehousesPage } from "./pages/WarehousesPage"
import { SuppliersPage } from "./pages/SuppliersPage"
import { WorkersPage } from "./pages/WorkersPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* BRAMA ZEWNĘTRZNA - tutaj nie ma paska bocznego */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* STREFA WEWNĘTRZNA - chroniona przez Layout i pasek boczny */}
        <Route element={<Layout />}>
          {/* Jeśli ktoś wejdzie na goły adres /, wyrzucamy go do magazynu */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Nasze pokoje (wpadają w miejsce <Outlet /> w Layoucie) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Miejsce na przyszłe pokoje (Produkty, Pracownicy itp.): */}
          <Route path="/products" element={<ProductsPage />} /> 
          <Route path="/warehouses" element={<WarehousesPage />} /> 
          <Route path="/suppliers" element={<SuppliersPage />} /> 
          <Route path="/admin/workers" element={<WorkersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}