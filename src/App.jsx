import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import DashboardHome from "./pages/dashboard/DashboardHome";
import ManageProducts from "./pages/dashboard/ManageProducts";
import ManageCarts from "./pages/dashboard/ManageCarts";
import ManageUsers from "./pages/dashboard/ManageUsers";

export default function App() {
  return (
    <Routes>
      {/* Storefront (public) */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Dashboard (protected) */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="carts" element={<ManageCarts />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
