import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankyouPage";
import PaymentPage from "./pages/PaymentsPage";

import Header from "./components/layout/Header";
import MinimalHeader from "./components/layout/MinimalHeader";
import FloatingCartButton from "./components/layout/FloatingCartButton";

import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminExpensesPage from "./pages/admin/AdminExpensesPage";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";

const HEADER_HEIGHT = 80; // single source of truth

function LayoutWrapper({ children }) {
  const location = useLocation();

  const pathname = location.pathname;

  const isMinimal =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/thankyou") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {/* STORE HEADERS ONLY */}
      {!isAdmin && (isMinimal ? <MinimalHeader /> : <Header />)}

      {/* MAIN CONTENT */}
      <main
        style={{
          paddingTop: !isAdmin && !isMinimal ? HEADER_HEIGHT : 0,
        }}
      >
        {children}
      </main>

      {/* FLOATING CART (STORE ONLY) */}
      {!isAdmin && !isMinimal && <FloatingCartButton />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* ================= STORE ================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thankyou" element={<ThankYouPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* ================= AUTH ================= */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* ================= PROFILE (PROTECTED) ================= */}
        
         <Route path="/profile" element={<ProfilePage />} />

          {/* ================= ADMIN LOGIN ================= */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ================= ADMIN (PROTECTED) ================= */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="expenses" element={<AdminExpensesPage />} />
          </Route>
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
