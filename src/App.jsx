import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminLoginPage from './pages/admin/AdminLoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
                {/* Admin login (PUBLIC) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
        path="/admin"
        element={
        <AdminProtectedRoute>
        <AdminLayout />
        </AdminProtectedRoute>
        }
        >
      <Route path="orders" element={<AdminOrdersPage />} />
      <Route path="orders/:id" element={<AdminOrderDetail />} />
      </Route>
      </Routes>

      

    </BrowserRouter>
    
  );
}

export default App;
