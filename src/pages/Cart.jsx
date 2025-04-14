import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

const Cart = () => {
  useEffect(() => {
    document.title = "Yulita Cakes - Keranjang";
  }, []);

  const { cartItems, updateQuantity, removeFromCart, clearCart, currency } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate("/checkout");
    }, 500);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price =
      item.productData.sale_price || item.productData.original_price;
    return acc + price * item.qty;
  }, 0);

  return (
    <div className="page-transition pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/collection"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Lanjut Belanja
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-8">
          Keranjang Anda
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Keranjang Kosong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Anda belum menambahkan kue apa pun ke keranjang Anda.
            </p>
            <Link to="/collection">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Cari Kue
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    Ringkasan Barang
                  </h2>
                  <Button
                    onClick={clearCart}
                    className="bg-pink-600 hover:bg-pink-700 text-white mt-6"
                  >
                    Kosongkan Keranjang
                  </Button>
                </div>
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 dark:border-gray-800 last:border-0"
                    >
                      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                          src={`/storage/${item.productData.images[0]?.image}`}
                          alt={item.productData.product_name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {item.productData.product_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {currency}
                            {item.productData.sale_price.toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.qty - 1)
                            }
                            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 font-medium text-gray-900 dark:text-white">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.qty + 1)
                            }
                            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>
                      {currency}
                      {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/place-order")}
                  disabled={isCheckingOut}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white mt-6"
                >
                  {isCheckingOut ? "Processing..." : "Proses Checkout"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
