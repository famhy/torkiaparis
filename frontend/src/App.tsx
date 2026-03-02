import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { MenuProvider } from "./context/MenuContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Admin from "./pages/Admin";

function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="confirmation" element={<OrderConfirmation />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </AdminAuthProvider>
      </CartProvider>
    </MenuProvider>
  );
}

export default App;
