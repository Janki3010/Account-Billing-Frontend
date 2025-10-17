import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Home from "./pages/Dashboard/Home";
import Company from "./pages/Dashboard/Company";
import Invoice from "./pages/Dashboard/Invoice";
import Item from "./pages/Dashboard/Item";
import Party from "./pages/Dashboard/Party";
import Payment from "./pages/Dashboard/Payment";
import ShopProfile from "./pages/Dashboard/ShopProfile"
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company"
        element={
          <ProtectedRoute>
            <Company />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoice"
        element={
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/item"
        element={
          <ProtectedRoute>
            <Item />
          </ProtectedRoute>
        }
      />
      <Route
        path="/party"
        element={
          <ProtectedRoute>
            <Party />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop-profile"
        element={
          <ProtectedRoute>
            <ShopProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
