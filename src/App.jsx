import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/layout/Footer";
import SearchBar from "./components/SearchBar";
import PrivateRoute from "./components/Route/PrivateRoute";
import GuestRoute from "./components/Route/GuestRoute";
import Product from "./pages/Product";
import Home from "./pages/Home";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Addresses from "./pages/Addresses";
import AccountDetails from "./pages/AccountDetail";
import OrderDetail from "./pages/OrderDetail";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { ScrollToTop } from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={() => "custom-toast"}
        progressClassName="custom-progress"
      />

      <Navbar />
      <SearchBar />

      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kue" element={<Product />} />
        <Route path="/tentang" element={<About />} />
        <Route path="/kontak" element={<Contact />} />
        <Route path="/kue/:slug" element={<ProductDetail />} />
        <Route path="/keranjang" element={<Cart />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/lupa-password" element={<ForgotPassword />} />

        <Route
          path="/masuk"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="pesanan" element={<Orders />} />
          <Route path="pesanan/:id" element={<OrderDetail />} />
          <Route path="alamat" element={<Addresses />} />
          <Route path="akun" element={<AccountDetails />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
};

export default App;
