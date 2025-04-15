import { useContext, useState, useEffect, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Loader2,
  Edit3,
  Info,
  Truck,
} from "lucide-react";

const MIDTRANS_CLIENT_KEY =
  import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "SB-Mid-client-xxxxxxxx";

const Checkout = () => {
  const { cartItems, authFetch, clearCart, formatCurrency, cartLoading } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);

  useEffect(() => {
    document.title = "Yulita Cakes - Checkout";
  }, []);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.querySelector(`script[src="${snapScript}"]`);
    let isNewScript = false;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.src = snapScript;
      scriptTag.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
      scriptTag.async = true;
      isNewScript = true;
    } else if (
      scriptTag.getAttribute("data-client-key") !== MIDTRANS_CLIENT_KEY
    ) {
      scriptTag.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    }
    scriptTag.onload = () => console.log("Midtrans Snap script loaded.");
    scriptTag.onerror = () =>
      console.error("Failed to load Midtrans Snap script.");
    if (isNewScript) {
      document.body.appendChild(scriptTag);
    }
    return () => {
      const snapScriptElement = document.querySelector(
        `script[src="${snapScript}"]`
      );
      if (snapScriptElement && document.body.contains(snapScriptElement)) {
        try {
          document.body.removeChild(snapScriptElement);
        } catch (e) {
          /* abaikan */
        }
      }
    };
  }, []);

  const fetchDefaultAddress = useCallback(async () => {
    setAddressLoading(true);
    setAddressError(null);
    setDefaultAddress(null);
    try {
      const response = await authFetch("/api/user/addresses");
      if (!response) {
        throw new Error("Gagal fetch alamat: Respon tidak valid.");
      }
      const data = await response.json();
      if (response.ok && data.data) {
        const defaultAddr =
          data.data.find((addr) => addr.is_default) || data.data[0];
        if (defaultAddr) {
          if (!defaultAddr.postal_code) {
            throw new Error(
              "Data alamat tidak lengkap (Kode Pos). Perbarui alamat Anda."
            );
          }
          setDefaultAddress(defaultAddr);
        } else {
          throw new Error(
            "Anda belum memiliki alamat pengiriman. Silakan tambahkan."
          );
        }
      } else {
        throw new Error(data.message || "Gagal mengambil data alamat.");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error fetching addresses:", error);
        setAddressError(error.message);
        if (error.message.includes("belum memiliki alamat")) {
          navigate("/dashboard/alamat");
          toast.warn(error.message);
        } else {
          toast.error(error.message);
        }
      }
    } finally {
      setAddressLoading(false);
    }
  }, [authFetch, navigate]);

  useEffect(() => {
    fetchDefaultAddress();
  }, [fetchDefaultAddress]);

  const fetchShippingOptions = useCallback(async () => {
    if (
      !defaultAddress ||
      !defaultAddress.postal_code ||
      cartItems.length === 0
    ) {
      setShippingOptions([]);
      setSelectedShippingOption(null);
      return;
    }
    setShippingLoading(true);
    setShippingError(null);
    setShippingOptions([]);
    setSelectedShippingOption(null);
    const totalWeight = cartItems.reduce((total, item) => {
      const weight = item.product ? Number(item.product.weight) || 0 : 0;
      return total + weight * item.qty;
    }, 0);
    const weightToSend = totalWeight < 1 ? 1 : totalWeight;

    try {
      const response = await authFetch(`/api/calculate-shipping-cost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          destination: defaultAddress.postal_code,
          weight: weightToSend,
          courier: "jne:tiki:pos:sicepat:jnt:anteraja",
        }),
      });
      if (!response) {
        throw new Error("Gagal fetch ongkir: Respon tidak valid.");
      }

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          /* Abaikan jika parse gagal */
        }
        throw new Error(
          errorData?.message ||
            `Gagal mengambil opsi pengiriman (${response.status})`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        if (data.length === 0) {
          setShippingError("Tidak ada opsi pengiriman ke Kode Pos Anda.");
          setShippingOptions([]);
        } else {
          const formattedOptions = data.map((option) => ({
            code: option.code?.toUpperCase() || "KURIR",
            name: option.name || "Kurir",
            service: option.service || "-",
            description: option.description || "-",
            cost: Number(option.cost) || 0,
            etd:
              typeof option.etd === "string"
                ? option.etd.replace(/hari/gi, "")?.trim() || "-"
                : option.etd || "-",
          }));
          setShippingOptions(formattedOptions);
        }
      } else {
        console.warn("Format data ongkir tidak sesuai (bukan array):", data);
        setShippingError("Format data opsi pengiriman tidak dikenal.");
        setShippingOptions([]);
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error fetching shipping options:", error);
        setShippingError(
          error.message || "Terjadi kesalahan saat mengambil opsi pengiriman."
        );
      }
      setShippingOptions([]);
    } finally {
      setShippingLoading(false);
    }
  }, [defaultAddress, cartItems, authFetch]);

  useEffect(() => {
    if (defaultAddress && cartItems.length > 0) {
      fetchShippingOptions();
    } else {
      setShippingOptions([]);
      setSelectedShippingOption(null);
    }
  }, [defaultAddress, cartItems.length, fetchShippingOptions]);

  const onSubmitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      if (
        !defaultAddress ||
        cartItems.length === 0 ||
        !selectedShippingOption ||
        isProcessing ||
        addressLoading ||
        shippingLoading ||
        cartLoading
      ) {
        if (!defaultAddress)
          toast.error("Alamat pengiriman utama belum diatur.");
        else if (cartItems.length === 0)
          toast.error("Keranjang belanja Anda kosong.");
        else if (!selectedShippingOption)
          toast.error("Silakan pilih metode pengiriman.");
        return;
      }
      setIsProcessing(true);
      setShippingError(null);

      let orderDatabaseId = null;

      try {
        const payload = {
          cartItems: cartItems
            .filter((item) => item.product)
            .map((item) => ({
              product_id: item.product.id,
              qty: item.qty,
            })),
          address_id: defaultAddress.id,
          shipping_option: {
            code: selectedShippingOption.code,
            service: selectedShippingOption.service,
            cost: selectedShippingOption.cost,
          },
        };
        const response = await authFetch("/api/midtrans/snap-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response) {
          setIsProcessing(false);
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Gagal memulai pembayaran."
          );
        }

        const snapToken = data.snapToken;
        orderDatabaseId = data.order_db_id;

        if (!snapToken || !orderDatabaseId) {
          throw new Error("Token atau ID Order tidak diterima dari server.");
        }

        if (window.snap && typeof window.snap.pay === "function") {
          window.snap.pay(snapToken, {
            onSuccess: function (result) {
              toast.success("Pembayaran berhasil!");
              clearCart();
              navigate(`/dashboard/pesanan/${orderDatabaseId}`, {
                state: { orderId: result.order_id, status: "success" },
              });
            },
            onPending: function (result) {
              toast.info("Pembayaran Anda sedang diproses.");
              navigate("/dashboard/pesanan", {
                state: { orderId: result.order_id, status: "pending" },
              });
            },
            onError: function (result) {
              console.error("Payment Error:", result);
              toast.error(
                `Pembayaran gagal: ${
                  result?.status_message || "Silakan coba lagi."
                }`
              );
              setIsProcessing(false);
            },
            onClose: function () {
              toast.warn("Anda menutup jendela pembayaran.", {
                autoClose: 3000,
              });
              setIsProcessing(false);
            },
          });
        } else {
          throw new Error("Komponen pembayaran (Snap Popup) belum siap.");
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error initiating payment:", error);
          toast.error(
            error.message || "Terjadi kesalahan saat memproses pembayaran."
          );
          setShippingError(error.message || "Gagal memproses pembayaran.");
        }
        setIsProcessing(false);
      }
    },
    [
      defaultAddress,
      cartItems,
      selectedShippingOption,
      isProcessing,
      authFetch,
      clearCart,
      navigate,
      addressLoading,
      shippingLoading,
      cartLoading,
    ]
  );

  return (
    <div className="pt-24 pb-16 bg-gray-100 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Keranjang
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-8 text-center">
          Checkout Pesanan
        </h1>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          <div className="lg:col-span-2 space-y-8">
            <section>
              <Title text1={"Alamat"} text2={"Pengiriman"} />
              {addressLoading ? (
                <div className="mt-4 p-4 text-center ...">
                  <Loader2 /> Memuat alamat...
                </div>
              ) : addressError ? (
                <div className="mt-4 p-4 text-center ...">
                  <Info /> {addressError}
                </div>
              ) : defaultAddress ? (
                <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm mt-4 border border-gray-200 dark:border-gray-700 relative">
                  <div className="absolute top-3 right-3">
                    {" "}
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/alamat")}
                      title="Ubah Alamat"
                      className="p-1 ..."
                    >
                      <Edit3 size={16} />
                    </button>{" "}
                  </div>
                  <div className="space-y-1 text-sm pr-8">
                    <p className="font-semibold ...">
                      {defaultAddress.recipient_name}{" "}
                      <span className="...">
                        {defaultAddress.is_default ? "[Utama]" : ""}
                      </span>
                    </p>
                    <p className="text-gray-600 ...">
                      {defaultAddress.phone_number}
                    </p>
                    <p className="text-gray-600 ...">
                      {defaultAddress.address_line1}
                    </p>
                    {defaultAddress.address_line2 && (
                      <p className="...">{defaultAddress.address_line2}</p>
                    )}
                    <p className="text-gray-600 ...">
                      {defaultAddress.city}, {defaultAddress.province}{" "}
                      {defaultAddress.postal_code}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-orange-600 dark:text-orange-400">
                  Alamat pengiriman tidak ditemukan.
                </p>
              )}
            </section>

            <section>
              <Title text1={"Produk"} text2={"Pesanan"} />
              {cartLoading ? (
                <div className="mt-4 p-4 text-center ...">
                  <Loader2 /> Memuat keranjang...
                </div>
              ) : cartItems.length > 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm mt-4 border border-gray-200 dark:border-gray-700">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItems.map((item) => (
                      <li
                        key={item.cart_item_id}
                        className="px-4 py-3 flex items-center gap-4"
                      >
                        <img
                          src={
                            item.product?.primary_image_url ||
                            "/placeholder.jpg"
                          }
                          alt={item.product?.product_name}
                          className="w-14 h-14 ..."
                        />
                        <div className="flex-grow min-w-0">
                          <p className="font-medium ...">
                            {item.product?.product_name}
                          </p>
                          <p className="text-xs ...">Qty: {item.qty}</p>
                          <p className="text-xs ...">
                            Berat: {item.product.weight}
                          </p>
                        </div>
                        <div className="text-sm font-medium ...">
                          {" "}
                          {formatCurrency(
                            (item.product
                              ? Number(item.product.effective_price) || 0
                              : 0) * item.qty
                          )}{" "}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Keranjang belanja Anda kosong.
                </p>
              )}
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <section>
              <Title text1={"Metode"} text2={"Pengiriman"} />
              {addressLoading || cartLoading ? (
                <p className="mt-4 text-sm ...">Memuat data...</p>
              ) : !defaultAddress ? (
                <p className="mt-4 text-sm ...">Alamat belum diatur.</p>
              ) : shippingLoading ? (
                <div className="mt-4 p-4 ...">
                  <Loader2 /> Mencari opsi...
                </div>
              ) : shippingError ? (
                <div className="mt-4 p-4 ...">
                  <Info /> {shippingError}
                </div>
              ) : shippingOptions.length > 0 ? (
                <div className="relative mt-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="max-h-60 overflow-y-auto space-y-1 p-2">
                    {shippingOptions.map((option, index) => (
                      <label
                        htmlFor={`shippingOption-${index}`}
                        key={`${option.code}-${option.service}-${index}`}
                        className="flex items-start p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 has-[:checked]:bg-pink-50 dark:has-[:checked]:bg-pink-900/50"
                      >
                        <input
                          type="radio"
                          name="shippingOption"
                          id={`shippingOption-${index}`}
                          value={index}
                          checked={
                            selectedShippingOption?.code === option.code &&
                            selectedShippingOption?.service === option.service
                          }
                          onChange={() => setSelectedShippingOption(option)}
                          className="mt-1 mr-3 ..."
                        />
                        <div className="text-sm leading-tight flex-grow">
                          <span className="font-medium ...">
                            {option.code} - {option.service}
                          </span>
                          <br />
                          <span className="text-xs ...">
                            {option.description}
                          </span>
                          <br />
                          <span className="font-semibold ...">
                            Biaya: {formatCurrency(option.cost)}
                          </span>
                          <br />
                          <span className="text-xs ...">
                            Estimasi: {option.etd}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 ...">
                  <Truck /> Tidak ada opsi pengiriman tersedia.
                </div>
              )}
            </section>

            <section>
              <CartTotal
                shippingCost={selectedShippingOption?.cost || 0}
                includeItemList={true}
              />
              <div className="w-full mt-6">
                <button
                  type="button"
                  onClick={onSubmitHandler}
                  id="pay-button-trigger"
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-base font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                    !defaultAddress ||
                    cartItems.length === 0 ||
                    !selectedShippingOption ||
                    isProcessing ||
                    cartLoading ||
                    addressLoading ||
                    shippingLoading
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800"
                  }`}
                  disabled={
                    !defaultAddress ||
                    cartItems.length === 0 ||
                    !selectedShippingOption ||
                    isProcessing ||
                    cartLoading ||
                    addressLoading ||
                    shippingLoading
                  }
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShoppingBag size={20} />
                  )}
                  {isProcessing ? "Memproses..." : "Bayar Sekarang"}
                </button>
              </div>
            </section>
            <div id="snap-container" className="w-full mt-4 min-h-[10px] z-10">
              {isProcessing && (
                <p className="text-center text-sm text-gray-500">
                  Menyiapkan pembayaran...
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
