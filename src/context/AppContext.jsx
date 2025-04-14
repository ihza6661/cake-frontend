import { createContext, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || null
  );
  const [cartItems, setCartItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const currency = "Rp. ";
  const delivery_fee = 0;
  const navigate = useNavigate();

  const API_BASE_URL = "/api";

  const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
  const inactivityTimerRef = useRef(null);
  const isLoggedOutRef = useRef(false);

  const updateToken = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      sessionStorage.setItem("token", newToken);
      isLoggedOutRef.current = false;
    } else {
      sessionStorage.removeItem("token");
    }
  }, []);

  const handleLogout = useCallback(
    async (logoutMessage) => {
      if (isLoggedOutRef.current || !sessionStorage.getItem("token")) return;
      isLoggedOutRef.current = true;

      try {
        await fetch(`${API_BASE_URL}/user/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Error saat API logout:", error);
      } finally {
        updateToken(null);
        setCartItems([]);
        navigate("/login");
        toast.info(
          logoutMessage || "Sesi Anda telah berakhir. Silakan login kembali."
        );
      }
    },
    [navigate, updateToken, API_BASE_URL]
  );

  const authFetch = useCallback(
    async (url, options = {}) => {
      const currentToken = sessionStorage.getItem("token");
      if (!currentToken) {
        handleLogout("Sesi tidak valid. Silakan login kembali.");
        throw new Error("User not authenticated");
      }

      const defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentToken}`,
      };

      const mergedOptions = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };

      try {
        const response = await fetch(url, mergedOptions);
        if (response.status === 401 && !isLoggedOutRef.current) {
          handleLogout("Sesi Anda telah berakhir. Silakan login kembali.");
          throw new Error("Unauthorized");
        }
        return response;
      } catch (error) {
        if (
          error.message !== "Unauthorized" &&
          !error.message.includes("Failed to fetch")
        ) {
          console.error("Fetch error:", error);
          toast.error("Terjadi kesalahan. Silakan coba lagi.");
        } else if (error.message.includes("Failed to fetch")) {
          console.error("Network error:", error);
          toast.error("Terjadi kesalahan jaringan. Silakan coba lagi.");
        }
        throw error;
      }
    },
    [handleLogout]
  );

  const fetchCartItems = useCallback(async () => {
    if (!token) return;
    try {
      const response = await authFetch(`${API_BASE_URL}/user/shopping_cart`);
      const data = await response.json();
      if (response.ok) {
        const transformedCartItems = data.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          qty: item.qty,
          productData: item.product,
        }));
        setCartItems(transformedCartItems);
      } else {
        toast.error(data.message || "Gagal mengambil data keranjang");
      }
    } catch (error) {
      if (
        error.message !== "Unauthorized" &&
        error.message !== "User not authenticated"
      ) {
        console.error("Error fetching cart items:", error);
      }
    }
  }, [authFetch, token, API_BASE_URL]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      if (sessionStorage.getItem("token")) {
        handleLogout("Sesi Anda telah berakhir karena tidak ada aktivitas.");
      }
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout, INACTIVITY_TIMEOUT]);

  useEffect(() => {
    if (token) {
      fetchCartItems();
      const activityEvents = [
        "click",
        "mousemove",
        "keydown",
        "scroll",
        "touchstart",
      ];
      activityEvents.forEach((eventName) =>
        window.addEventListener(eventName, resetInactivityTimer)
      );
      resetInactivityTimer();
      return () => {
        activityEvents.forEach((eventName) =>
          window.removeEventListener(eventName, resetInactivityTimer)
        );
        if (inactivityTimerRef.current)
          clearTimeout(inactivityTimerRef.current);
      };
    } else {
      setCartItems([]);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
  }, [token, fetchCartItems, resetInactivityTimer]);

  const addToCart = useCallback(
    async (itemId, size, quantity = 1) => {
      try {
        const response = await authFetch(`${API_BASE_URL}/user/shopping_cart`, {
          method: "POST",
          body: JSON.stringify({
            product_id: itemId,
            qty: quantity,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Produk berhasil ditambahkan ke keranjang");
          fetchCartItems();
        } else {
          toast.error(data.message || "Gagal menambahkan produk ke keranjang");
        }
      } catch (error) {
        if (error.message !== "Unauthorized") {
          console.error("Error adding to cart:", error);
          toast.error("Terjadi kesalahan saat menambahkan produk");
        }
      }
    },
    [authFetch, fetchCartItems, API_BASE_URL]
  );

  const updateQuantity = useCallback(
    async (cartItemId, qty) => {
      try {
        const response = await authFetch(
          `${API_BASE_URL}/user/shopping_cart/${cartItemId}`,
          { method: "PUT", body: JSON.stringify({ qty }) }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success("Jumlah produk berhasil diperbarui");
          fetchCartItems();
        } else {
          toast.error(data.message || "Gagal mengupdate jumlah produk");
        }
      } catch (error) {
        if (error.message !== "Unauthorized") {
          console.error("Error updating quantity:", error);
          toast.error("Terjadi kesalahan saat mengupdate jumlah");
        }
      }
    },
    [authFetch, fetchCartItems, API_BASE_URL]
  );

  const removeFromCart = useCallback(
    async (cartItemId) => {
      try {
        const response = await authFetch(
          `${API_BASE_URL}/user/shopping_cart/${cartItemId}`,
          { method: "DELETE" }
        );
        if (response.ok || response.status === 204) {
          toast.success("Produk berhasil dihapus dari keranjang");
          fetchCartItems();
        } else {
          let data = {};
          try {
            data = await response.json();
          } catch (e) {
            /* Abaikan */
          }
          toast.error(data.message || "Gagal menghapus produk dari keranjang");
        }
      } catch (error) {
        if (error.message !== "Unauthorized") {
          console.error("Error removing from cart:", error);
          toast.error("Terjadi kesalahan saat menghapus produk");
        }
      }
    },
    [authFetch, fetchCartItems, API_BASE_URL]
  );

  const clearCart = useCallback(async () => {
    try {
      const response = await authFetch(
        `${API_BASE_URL}/user/shopping_cart/clear`,
        { method: "DELETE" }
      );
      if (response.ok || response.status === 204) {
        setCartItems([]);
        toast.success("Keranjang berhasil dikosongkan");
      } else {
        let data = {};
        try {
          data = await response.json();
        } catch (e) {
          /* Abaikan */
        }
        toast.error(data.message || "Gagal mengosongkan keranjang");
      }
    } catch (error) {
      if (error.message !== "Unauthorized") {
        console.error("Error clearing cart:", error);
        toast.error("Terjadi kesalahan saat mengosongkan keranjang");
      }
    }
  }, [authFetch, API_BASE_URL]);

  const getCartCount = () =>
    cartItems.reduce((total, item) => total + item.qty, 0);

  const getCartAmount = () =>
    cartItems.reduce((total, cartItem) => {
      const product = cartItem.productData;
      if (!product) return total;
      const salePrice = Number(product.sale_price) || 0;
      const originalPrice = Number(product.original_price) || 0;
      const price = salePrice > 0 ? salePrice : originalPrice;
      return total + price * cartItem.qty;
    }, 0);

  const value = {
    token,
    setToken: updateToken,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    getCartAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    navigate,
    handleLogout,
    authFetch,
    API_BASE_URL,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
