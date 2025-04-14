import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/layout/Footer";
import SearchBar from "./components/SearchBar";
import PrivateRoute from "./components/Route/PrivateRoute";
import GuestRoute from "./components/Route/GuestRoute";
import Categories from "./components/Categories";
import LatestColletion from "./components/LatestColletion";
import Hero from "./components/Hero";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Addresses from "./pages/Addresses";
import AccountDetails from "./pages/AccountDetail";
import OrderDetail from "./pages/OrderDetail";
import PaymentSuccess from "./pages/PaymentSucces";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import FeaturesSection from "./components/FeaturesSection";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import { ScrollToTop } from "./components/ScrollToTop";

const Home = () => {
  useEffect(() => {
    document.title = "Yulita Cakes";
  }, []);

  return (
    <div className="page-transition">
      <Hero />
      <LatestColletion />
      <Categories />
      <FeaturesSection />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

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
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/login"
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
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="account" element={<AccountDetails />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
};

export default App;
