import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Loader2,
} from "lucide-react";

const Cart = () => {
  useEffect(() => {
    document.title = "Yulita Cakes - Keranjang";
  }, []);

  const { cartItems, updateQuantity, removeFromCart, clearCart, currency } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);

  const handleUpdateQuantity = (cartItemId, currentQty, change) => {
    const newQuantity = currentQty + change;
    if (newQuantity < 1) {
      if (window.confirm("Hapus item ini dari keranjang?")) {
        removeFromCart(cartItemId);
      }
      return;
    }
    updateQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = (cartItemId) => {
    removeFromCart(cartItemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Yakin ingin mengosongkan seluruh keranjang?")) {
      setIsClearingCart(true);
      try {
        await clearCart();
      } catch (error) {
        // Tangani error
      } finally {
        setIsClearingCart(false);
      }
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      navigate("/checkout");
    }, 300);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product ? Number(item.product.effective_price) || 0 : 0;
    return acc + price * item.qty;
  }, 0);

  const formatCurrency = (amount) => {
    return (
      currency + amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })
    );
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/kue"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Lanjut Belanja
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-8">
          Keranjang Belanja Anda
        </h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-sm"
          >
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Keranjang Anda Kosong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Sepertinya Anda belum menambahkan kue apa pun.
            </p>
            <Link to="/kue">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 h-10 px-5 py-2">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Cari Kue Sekarang
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Daftar Item Keranjang */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    Item di Keranjang ({cartItems.length})
                  </h2>
                  <button
                    type="button"
                    onClick={handleClearCart}
                    disabled={isClearingCart}
                    className="inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClearingCart ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1" />
                    )}
                    Kosongkan Keranjang
                  </button>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.li
                        key={item.cart_item_id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, x: -100 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-5 py-4"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <Link
                            to={`/kue/${item.product?.slug}`}
                            className="flex-shrink-0"
                          >
                            <img
                              src={
                                item.product?.primary_image_url ||
                                "/placeholder.jpg"
                              }
                              alt={item.product?.product_name || "Produk"}
                              className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                              loading="lazy"
                            />
                          </Link>
                          <div className="flex-grow min-w-0">
                            <Link to={`/kue/${item.product?.slug}`}>
                              <p className="text-base font-medium text-gray-900 dark:text-white truncate hover:text-pink-600 dark:hover:text-pink-400">
                                {item.product?.product_name ||
                                  "Nama Produk Error"}
                              </p>
                            </Link>
                            <p className="text-sm font-semibold text-pink-700 dark:text-pink-400 mt-1">
                              {/* Gunakan effective_price dari product resource */}
                              {formatCurrency(
                                item.product
                                  ? Number(item.product.effective_price) || 0
                                  : 0
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0 flex-shrink-0">
                            {/* Quantity Controls */}
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.cart_item_id,
                                  item.qty,
                                  -1
                                )
                              }
                              aria-label="Kurangi jumlah"
                              className="p-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                              disabled={item.qty <= 1} // Disable jika qty 1
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-medium text-gray-900 dark:text-white text-sm w-8 text-center">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.cart_item_id,
                                  item.qty,
                                  1
                                )
                              }
                              aria-label="Tambah jumlah"
                              className="p-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveItem(item.cart_item_id)
                              }
                              aria-label="Hapus item"
                              className="ml-2 p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              {/* Gunakan div biasa, bukan Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-5">
                  Ringkasan Pesanan
                </h2>
                <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal ({cartItems.length} item)</span>
                    <span className="font-medium">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {/* Anda bisa tambahkan estimasi ongkir di sini jika sudah ada */}
                  {/* <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                        <span>Estimasi Ongkir</span>
                                        <span className="font-medium">{formatCurrency(0)}</span>
                                     </div> */}
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>{" "}
                  {/* Sementara total = subtotal */}
                </div>
                {/* Tombol HTML standar */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                    isCheckingOut || cartItems.length === 0
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800"
                  }`}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
                    </>
                  ) : (
                    <>
                      Lanjut ke Checkout{" "}
                      <ArrowLeft className="w-5 h-5 transform rotate-180 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
