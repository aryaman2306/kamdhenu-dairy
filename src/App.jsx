import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';

import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 🔐 EVERYTHING under /admin is protected */}
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
          <Route path="products" element={<AdminProductsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
