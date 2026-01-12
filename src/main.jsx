import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminOrderDetail from './pages/admin/AdminOrderDetail.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
<Route path="/admin/orders" element={
  <ProtectedRoute>
    <AdminOrdersPage />
  </ProtectedRoute>
} />
<Route path="/admin/orders/:id" element={
  <ProtectedRoute>
    <AdminOrderDetail />
  </ProtectedRoute>
} />
<Route path="/admin/products" element={
  <ProtectedRoute>
    <AdminProductsPage />
  </ProtectedRoute>
} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
