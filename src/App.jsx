import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';

// Route guards
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* 🔐 Admin auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 🔒 Admin protected routes */}
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminOrdersPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <AdminProtectedRoute>
              <AdminOrderDetail />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <AdminProductsPage />
            </AdminProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
