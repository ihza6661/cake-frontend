import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { Download, Copy, Loader2, ArrowLeft, CheckCheck } from "lucide-react";

const OrderDetail = () => {
  const { authFetch, currency } = useContext(AppContext);
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Pending",
          class:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        };
      case "paid":
        return {
          text: "Dibayar",
          class:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        };
      case "processing":
        return {
          text: "Diproses",
          class:
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        };
      case "shipped":
        return {
          text: "Dikirim",
          class:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        };
      case "delivered":
        return {
          text: "Diterima",
          class:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        };
      case "cancelled":
        return {
          text: "Dibatalkan",
          class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
      case "expired":
        return {
          text: "Kadaluarsa",
          class:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        };
      case "deny":
        return {
          text: "Ditolak",
          class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
      case "settlement":
        return {
          text: "Lunas",
          class:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        };
      default:
        return {
          text: status,
          class:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        };
    }
  };

  useEffect(() => {
    document.title = "Yulita Cakes - Detail Pesanan";
  }, []);

  const fetchOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setOrder(null);
    try {
      const response = await authFetch(`/api/user/orders/${orderId}`);
      if (!response) {
        throw new Error("Gagal menghubungi server atau masalah otentikasi.");
      }
      const data = await response.json();
      if (response.ok) {
        if (!data.data) throw new Error("Format data pesanan tidak sesuai.");
        setOrder(data.data);
        document.title = `Yulita Cakes - Order #${
          data.data?.order_number || orderId
        }`;
      } else {
        if (response.status === 404) {
          throw new Error("Pesanan tidak ditemukan atau bukan milik Anda.");
        }
        throw new Error(data.message || "Gagal mengambil detail pesanan.");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error fetching order detail:", error);
        setError(
          error.message || "Terjadi kesalahan saat mengambil detail pesanan."
        );
        document.title = "Yulita Cakes - Pesanan Tidak Ditemukan";
      }
    } finally {
      setIsLoading(false);
    }
  }, [authFetch, orderId]);

  useEffect(() => {
    if (orderId && orderId !== "undefined") {
      fetchOrder();
    } else {
      setError("ID Pesanan tidak valid.");
      setIsLoading(false);
      document.title = "Yulita Cakes - ID Pesanan Tidak Valid";
    }
  }, [orderId, fetchOrder]);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      setOrder(null);
      try {
        const response = await authFetch(`/api/user/orders/${orderId}`);
        if (!response) {
          setError("Gagal menghubungi server atau masalah otentikasi.");
          setIsLoading(false);
          return;
        }
        const data = await response.json();
        if (response.ok) {
          setOrder(data.data);
          document.title = `Yulita Cakes - Order #${
            data.data?.order_number || orderId
          }`;
        } else {
          if (response.status === 404) {
            setError("Pesanan tidak ditemukan atau Anda tidak memiliki akses.");
            document.title = "Yulita Cakes - Pesanan Tidak Ditemukan";
          } else {
            setError(data.message || "Gagal mengambil detail pesanan.");
          }
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error fetching order detail:", error);
          setError(
            error.message || "Terjadi kesalahan saat mengambil detail pesanan."
          );
          document.title = "Yulita Cakes - Error";
        } else {
          setError("Anda tidak memiliki izin untuk melihat pesanan ini.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId && orderId !== "undefined") {
      fetchOrder();
    } else {
      setError("ID Pesanan tidak valid.");
      setIsLoading(false);
      document.title = "Yulita Cakes - ID Pesanan Tidak Valid";
    }
  }, [authFetch, orderId, navigate]);

  const formatCurrency = (amount) => {
    return (
      currency +
      Number(amount || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 })
    );
  };

  const copyTrackingNumber = () => {
    if (order?.shipment?.tracking_number) {
      navigator.clipboard
        .writeText(order.shipment.tracking_number)
        .then(() => toast.success("Nomor resi berhasil disalin"))
        .catch((err) => {
          console.error("Gagal menyalin resi:", err);
          toast.error("Gagal menyalin nomor resi.");
        });
    }
  };

  const downloadInvoice = () => {
    const invoiceElement = document.getElementById("invoice-content");
    const downloadButton = document.getElementById("download-button");
    const copyButtons = invoiceElement?.querySelectorAll(".copy-button");

    if (!invoiceElement) {
      toast.error("Elemen nota tidak ditemukan.");
      return;
    }

    if (downloadButton) downloadButton.style.visibility = "hidden";
    const originalDisplays = [];
    copyButtons?.forEach((button) => {
      originalDisplays.push({ element: button, display: button.style.display });
      button.style.display = "none";
    });

    html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `invoice-${order?.order_number || orderId}.png`;
        link.href = canvas.toDataURL("image/png", 0.95);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error("Gagal mengunduh invoice:", err);
        toast.error("Gagal mengunduh nota.");
      })
      .finally(() => {
        if (downloadButton) downloadButton.style.visibility = "visible";
        originalDisplays.forEach((item) => {
          item.element.style.display = item.display || "";
        });
      });
  };

  const handleConfirmDelivery = useCallback(async () => {
    if (!order || isConfirming || order.status !== "shipped") return;

    if (!window.confirm("Apakah Anda yakin pesanan ini sudah Anda terima?")) {
      return;
    }

    setIsConfirming(true);
    try {
      const response = await authFetch(
        `/api/user/orders/${order.id}/confirm-delivery`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );
      if (!response) {
        setIsConfirming(false);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        toast.success(
          data.message || "Pesanan berhasil dikonfirmasi diterima."
        );
        setOrder((prevOrder) =>
          prevOrder
            ? {
                ...prevOrder,
                status: "delivered",
                shipment: { ...prevOrder.shipment, status: "delivered" },
              }
            : null
        );
      } else {
        toast.error(data.message || "Gagal mengkonfirmasi pesanan.");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error confirming delivery:", error);
        toast.error(error.message || "Terjadi kesalahan saat konfirmasi.");
      }
    } finally {
      setIsConfirming(false);
    }
  }, [order, authFetch, isConfirming, fetchOrder]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-10 h-10 animate-spin text-pink-600" />{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center px-4 py-8">
        <div
          className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative max-w-md w-full"
          role="alert"
        >
          <strong className="font-bold block sm:inline">
            Terjadi Kesalahan!
          </strong>
          <span className="block sm:inline ml-1">{error}</span>
        </div>
        <Link
          to="/dashboard/pesanan"
          className="mt-6 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center px-4 py-8">
        <div
          className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg relative max-w-md w-full"
          role="alert"
        >
          <strong className="font-bold block sm:inline">Informasi!</strong>
          <span className="block sm:inline ml-1">
            Data pesanan tidak dapat dimuat.
          </span>
        </div>
        <Link
          to="/dashboard/pesanan"
          className="mt-6 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  const orderStatusInfo = formatStatus(order.status);
  const paymentStatusInfo = order.payment
    ? formatStatus(order.payment.status)
    : null;
  const shipmentStatusInfo = order.shipment
    ? formatStatus(order.shipment.status)
    : null;

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-5xl">
      {" "}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
        <Link
          to="/dashboard/pesanan"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />{" "}
          Kembali ke Daftar Pesanan
        </Link>
        <button
          id="download-button"
          type="button"
          onClick={downloadInvoice}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 shadow-sm dark:focus:ring-offset-gray-800 w-full sm:w-auto"
        >
          <Download size={16} /> Unduh Nota
        </button>
      </div>
      <div
        id="invoice-content"
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
      >
        <div className="p-4 sm:p-6 md:p-8">
          {" "}
          <div className="text-center mb-6 md:mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-pink-700 dark:text-pink-400 mb-1">
              Yulita Cakes
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nota Pesanan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8 text-sm">
            {/* Order Info */}
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
                Informasi Pesanan
              </h3>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  No. Order:
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-right">
                  #{order.order_number}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Tanggal:
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-right">
                  {format(new Date(order.order_date), "dd MMM yy, HH:mm", {
                    locale: id,
                  })}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Status Pesanan:
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${orderStatusInfo.class}`}
                >
                  {orderStatusInfo.text}
                </span>
              </p>
              {paymentStatusInfo && (
                <p className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Pembayaran:
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${paymentStatusInfo.class}`}
                  >
                    {paymentStatusInfo.text}
                  </span>
                </p>
              )}
              {shipmentStatusInfo && (
                <p className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Pengiriman:
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${shipmentStatusInfo.class}`}
                  >
                    {shipmentStatusInfo.text}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-semibold mb-3 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
                Alamat Pengiriman
              </h3>
              {order.address ? (
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {order.address.recipient_name}
                  </p>
                  <p>{order.address.phone_number}</p>
                  <p>{order.address.address_line1}</p>
                  {order.address.address_line2 && (
                    <p>{order.address.address_line2}</p>
                  )}
                  <p>
                    {order.address.city}, {order.address.province}{" "}
                    {order.address.postal_code}
                  </p>
                </div>
              ) : (
                <p className="italic text-gray-500 dark:text-gray-400">
                  Alamat tidak tersedia.
                </p>
              )}
              {order.shipment && (
                <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-600 space-y-1">
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Kurir:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-right">
                      {order.shipment.courier} ({order.shipment.service})
                    </span>
                  </p>
                  {order.shipment.tracking_number && (
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        No. Resi:
                      </span>
                      <div className="flex items-center gap-1 text-right">
                        <span className="text-gray-600 dark:text-gray-400 break-all">
                          {order.shipment.tracking_number}
                        </span>
                        <button
                          type="button"
                          onClick={copyTrackingNumber}
                          className="copy-button p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex-shrink-0"
                          title="Salin nomor resi"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
            Rincian Produk
          </h3>
          <div className="flow-root">
            {" "}
            <ul
              role="list"
              className="-my-4 divide-y divide-gray-200 dark:divide-gray-700"
            >
              {order.order_items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col sm:flex-row py-4 space-y-3 sm:space-y-0 sm:space-x-4"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={
                        item.product?.primary_image_url || "/placeholder.jpg"
                      }
                      alt={item.product?.product_name || "Gambar Produk"}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                      loading="lazy"
                    />
                  </div>

                  <div className="relative flex flex-1 flex-col justify-between">
                    {/* Info Produk */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        <Link
                          to={
                            item.product
                              ? `/kue/${item.product.slug}`
                              : "#"
                          }
                          className="hover:text-pink-600 dark:hover:text-pink-400"
                        >
                          {item.product?.product_name ||
                            "Produk Tidak Tersedia"}
                        </Link>
                      </h4>
                    </div>

                    <div className="flex flex-1 items-end justify-between text-sm mt-2 sm:mt-0">
                      <p className="text-gray-600 dark:text-gray-300">
                        {formatCurrency(item.price)}{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          x
                        </span>{" "}
                        {item.qty}
                      </p>
                      <div className="flex">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Subtotal Produk:
              </span>
              <span className="font-medium text-gray-800 dark:text-white">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Ongkos Kirim:
              </span>
              <span className="font-medium text-gray-800 dark:text-white">
                {formatCurrency(order.shipping_cost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-3 border-t border-dashed border-gray-200 dark:border-gray-600 mt-3 text-gray-900 dark:text-white">
              <span>Grand Total:</span>
              <span>{formatCurrency(order.grand_total)}</span>
            </div>
          </div>
        </div>{" "}
        {order.payment && (
          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-4 sm:px-6 md:px-8 mt-6 border-t border-gray-200 dark:border-gray-700 text-sm">
            <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-white">
              Ringkasan Pembayaran
            </h3>
            <div className="space-y-1">
              <p className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Metode:
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-right">
                  {order.payment.payment_type.replace(/_/g, " ").toUpperCase()}
                </span>{" "}
              </p>
              {paymentStatusInfo && (
                <p className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Status:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${paymentStatusInfo.class}`}
                  >
                    {paymentStatusInfo.text}
                  </span>
                </p>
              )}
              <p className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  ID Transaksi:
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-right break-all">
                  {order.payment.transaction_id || "-"}
                </span>
              </p>
              {order.payment.created_at && (
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Waktu Pembayaran:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-right">
                    {format(
                      new Date(order.payment.created_at),
                      "dd MMM yy, HH:mm",
                      { locale: id }
                    )}
                  </span>
                </p>
              )}
              {order.status === 'shipped' && (
                   <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                           Apakah pesanan ini sudah Anda terima dengan baik?
                       </p>
                       <button
                           type="button"
                           onClick={handleConfirmDelivery}
                           disabled={isConfirming}
                           className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 shadow-sm dark:focus:ring-offset-gray-800 disabled:bg-green-400"
                       >
                            {isConfirming ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCheck className="w-4 h-4"/>}
                            {isConfirming ? "Memproses..." : "Konfirmasi Pesanan Diterima"}
                       </button>
                   </div>
                )}
            </div>
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default OrderDetail;
