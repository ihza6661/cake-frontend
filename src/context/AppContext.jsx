import { createContext, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || null
  );
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const currency = "Rp. ";
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
  const inactivityTimerRef = useRef(null);
  const isLoggedOutRef = useRef(false);

  const updateToken = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      sessionStorage.setItem("token", newToken);
    } else {
      sessionStorage.removeItem("token");
    }
  }, []);

  const handleLogout = useCallback(
    async (logoutMessage) => {
      if (isLoggedOutRef.current) return;
      isLoggedOutRef.current = true;
      const currentTokenForApiCall = sessionStorage.getItem("token");
      try {
        if (currentTokenForApiCall) {
          await fetch(`${API_BASE_URL}/user/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${currentTokenForApiCall}`,
            },
          });
        }
      } catch (error) {
        console.error("Error saat API logout:", error);
      } finally {
        updateToken(null);
        setCartItems([]);
        if (location.pathname !== "/masuk") {
          navigate("/masuk");
        }
        toast.info(
          logoutMessage || "Sesi Anda telah berakhir. Silakan login kembali."
        );
        isLoggedOutRef.current = false;
      }
    },
    [navigate, updateToken, API_BASE_URL, location.pathname]
  );

  const authFetch = useCallback(
    async (url, options = {}) => {
      const currentToken = sessionStorage.getItem("token");
      if (!currentToken) {
        if (!isLoggedOutRef.current) {
          handleLogout("Sesi tidak ditemukan. Silakan login kembali.");
        }
        return null;
      }

      const defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentToken}`,
      };
      const mergedOptions = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
      };

      try {
        const response = await fetch(url, mergedOptions);
        if (response.status === 401) {
          if (!isLoggedOutRef.current) {
            handleLogout("Sesi Anda tidak valid atau telah berakhir.");
          }
          throw new Error("Unauthorized");
        }
        if (response.status === 403) {
          toast.error("Anda tidak memiliki izin untuk aksi ini.");
          throw new Error("Forbidden");
        }
        return response;
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("AuthFetch Error:", error);
          if (error.message.includes("Failed to fetch")) {
            toast.error("Terjadi masalah koneksi jaringan.");
          } else {
            toast.error("Terjadi kesalahan koneksi atau server.");
          }
        }
        throw error;
      }
    },
    [handleLogout]
  );

  const fetchCartItems = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }
    setCartLoading(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/user/shopping_cart`);
      if (!response) {
        setCartLoading(false);
        return;
      }
      const data = await response.json();
      if (response.ok) {
        if (Array.isArray(data.data)) {
          setCartItems(data.data);
        } else if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          console.warn("Format data keranjang tidak sesuai:", data);
          setCartItems([]);
        }
      } else {
        if (response.status !== 401 && response.status !== 403) {
          toast.error(data?.message || "Gagal mengambil data keranjang");
        }
        setCartItems([]);
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error fetching cart items (catch):", error.message);
      }
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [authFetch, token, API_BASE_URL]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (sessionStorage.getItem("token")) {
      inactivityTimerRef.current = setTimeout(() => {
        if (!isLoggedOutRef.current) {
          handleLogout("Sesi Anda telah berakhir karena tidak ada aktivitas.");
        }
      }, INACTIVITY_TIMEOUT);
    }
  }, [handleLogout, INACTIVITY_TIMEOUT]);

  useEffect(() => {
    isLoggedOutRef.current = !token;
    if (token) {
      fetchCartItems();
      const activityEvents = [
        "click",
        "mousemove",
        "keydown",
        "scroll",
        "touchstart",
      ];
      const options = { passive: true };
      activityEvents.forEach((eventName) =>
        window.addEventListener(eventName, resetInactivityTimer, options)
      );
      resetInactivityTimer();
      return () => {
        activityEvents.forEach((eventName) =>
          window.removeEventListener(eventName, resetInactivityTimer, options)
        );
        if (inactivityTimerRef.current)
          clearTimeout(inactivityTimerRef.current);
      };
    } else {
      setCartItems([]);
      setCartLoading(false);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      isLoggedOutRef.current = false;
    }
  }, [token, fetchCartItems, resetInactivityTimer]);

  const formatCurrency = useCallback(
    (amount) => {
      // Pastikan amount adalah number, default ke 0 jika tidak valid
      const numberAmount = Number(amount) || 0;
      return (
        currency +
        numberAmount.toLocaleString("id-ID", { minimumFractionDigits: 0 })
      );
    },
    [currency]
  ); // Dependensi hanya currency

  const addToCart = useCallback(
    async (itemId, size, quantity = 1) => {
      const currentToken = sessionStorage.getItem("token");
      if (!currentToken) {
        handleLogout("Anda harus login untuk menambahkan item ke keranjang.");
        return;
      }

      try {
        const response = await authFetch(`${API_BASE_URL}/user/shopping_cart`, {
          method: "POST",
          body: JSON.stringify({ product_id: itemId, qty: quantity }),
        });

        if (!response) return;

        if (response.ok || response.status === 200) {
          const data = await response.json().catch(() => ({}));
          toast.success(data.message || "Produk berhasil ditambahkan");
          await fetchCartItems();
        } else {
          if (response.status !== 401 && response.status !== 403) {
            const data = await response.json().catch(() => ({}));
            toast.error(data.message || "Gagal menambahkan produk");
          }
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error adding to cart (catch):", error.message);
        }
      }
    },
    [authFetch, fetchCartItems, API_BASE_URL, handleLogout]
  );

  const removeFromCart = useCallback(
    async (cartItemId) => {
      try {
        const response = await authFetch(
          `${API_BASE_URL}/user/shopping_cart/${cartItemId}`,
          { method: "DELETE" }
        );
        if (!response) return;
        if (!response.ok && response.status !== 204) {
          let data = {};
          try {
            data = await response.json();
          } catch (e) {
            /* Abaikan */
          }
          if (response.status !== 401 && response.status !== 403) {
            toast.error(data.message || "Gagal menghapus produk");
          }
        } else {
          toast.success("Produk berhasil dihapus");
          await fetchCartItems();
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error removing from cart (catch):", error.message);
        }
      }
    },
    [authFetch, fetchCartItems, API_BASE_URL]
  );

  const updateQuantity = useCallback(
    async (cartItemId, qty) => {
      if (qty < 1) {
        if (window.confirm("Jumlah tidak valid. Hapus item dari keranjang?")) {
          removeFromCart(cartItemId);
        }
        return;
      }
      try {
        const response = await authFetch(
          `${API_BASE_URL}/user/shopping_cart/${cartItemId}`,
          { method: "PUT", body: JSON.stringify({ qty }) }
        );
        if (!response) return;
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (response.status !== 401 && response.status !== 403) {
            toast.error(data.message || "Gagal mengupdate jumlah produk");
          }
        } else {
          await fetchCartItems();
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error updating quantity (catch):", error.message);
        }
      }
    },
    [authFetch, fetchCartItems, API_BASE_URL, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    try {
      const response = await authFetch(
        `${API_BASE_URL}/user/shopping_cart/clear`,
        { method: "DELETE" }
      );
      if (!response) return;
      if (!response.ok && response.status !== 204) {
        let data = {};
        try {
          data = await response.json();
        } catch (e) {
          /* Abaikan */
        }
        if (response.status !== 401 && response.status !== 403) {
          toast.error(data.message || "Gagal mengosongkan keranjang");
        }
      } else {
        setCartItems([]);
        toast.success("Keranjang berhasil dikosongkan");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error clearing cart (catch):", error.message);
      }
    }
  }, [authFetch, API_BASE_URL]);

  const getCartCount = () =>
    cartItems.reduce((total, item) => total + (item.qty || 0), 0);

  const getCartAmount = () =>
    cartItems.reduce((total, cartItem) => {
      const product = cartItem.product;
      if (!product) return total;
      const price = Number(product.effective_price) || 0;
      return total + price * (cartItem.qty || 0);
    }, 0);

  const value = {
    token,
    setToken: updateToken,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    cartLoading,
    addToCart,
    getCartCount,
    getCartAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    navigate,
    handleLogout,
    authFetch,
    formatCurrency,
    API_BASE_URL,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
