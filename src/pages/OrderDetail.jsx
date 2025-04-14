import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { Download, Copy, Loader2, ArrowLeft } from "lucide-react";

const OrderDetail = () => {
  const { authFetch, currency } = useContext(AppContext);
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Yulita Cakes - Detail Pesanan";
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      setOrder(null);
      try {
        const response = await authFetch(`/api/user/orders/${orderId}`);
        if (!response) {
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
    };

    if (orderId) {
      fetchOrder();
    } else {
      setError("ID Pesanan tidak valid.");
      setIsLoading(false);
    }
  }, [authFetch, orderId]);

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
    const copyButton = invoiceElement?.querySelector(".copy-button");
    if (!invoiceElement) return;

    if (downloadButton) downloadButton.style.visibility = "hidden";
    let originalDisplayCopy = "";
    if (copyButton) {
      originalDisplayCopy = copyButton.style.display;
      copyButton.style.display = "none";
    }

    html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `invoice-${order?.order_number || orderId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
      .catch((err) => {
        console.error("Gagal mengunduh invoice:", err);
        toast.error("Gagal mengunduh invoice.");
      })
      .finally(() => {
        if (downloadButton) downloadButton.style.visibility = "visible";
        if (copyButton) copyButton.style.display = originalDisplayCopy;
      });
  };

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
      default:
        return {
          text: status,
          class:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        };
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center px-4">
        <p className="text-red-500 text-xl mb-4">⚠️ {error}</p>
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Pesanan
        </Link>
      </div>
    );

  if (!order) return null;

  const orderStatusInfo = formatStatus(order.status);
  const paymentStatusInfo = order.payment
    ? formatStatus(order.payment.status)
    : null;
  const shipmentStatusInfo = order.shipment
    ? formatStatus(order.shipment.status)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Pesanan
        </Link>
        <button
          id="download-button"
          type="button"
          onClick={downloadInvoice}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <Download size={16} /> Unduh Nota
        </button>
      </div>

      {/* Konten Invoice */}
      <div
        id="invoice-content"
        className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 md:p-8"
      >
        {/* Header Invoice */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-pink-700 dark:text-pink-400 mb-1">
            Yulita Cakes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nota Pesanan
          </p>
        </div>

        {/* Detail Order & Pengiriman */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          {/* Info Order */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Informasi Pesanan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                No. Order:
              </span>{" "}
              #{order.order_number}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Tanggal:
              </span>{" "}
              {format(new Date(order.order_date), "dd MMMM yyyy, HH:mm", {
                locale: id,
              })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Status Pesanan:
              </span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${orderStatusInfo.class}`}
              >
                {orderStatusInfo.text}
              </span>
            </p>
            {paymentStatusInfo && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Status Pembayaran:
                </span>{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${paymentStatusInfo.class}`}
                >
                  {paymentStatusInfo.text}
                </span>
              </p>
            )}
            {shipmentStatusInfo && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Status Pengiriman:
                </span>{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${shipmentStatusInfo.class}`}
                >
                  {shipmentStatusInfo.text}
                </span>
              </p>
            )}
          </div>
          {/* Info Pengiriman & Alamat */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Alamat Pengiriman
            </h3>
            {order.address ? (
              <>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {order.address.recipient_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.phone_number}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.address_line1}
                </p>
                {order.address.address_line2 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.address.address_line2}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.address.city}, {order.address.province}{" "}
                  {order.address.postal_code}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Alamat tidak tersedia.</p>
            )}

            {/* Info Kurir */}
            {order.shipment && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Kurir:
                  </span>{" "}
                  {order.shipment.courier} ({order.shipment.service})
                </p>
                {order.shipment.tracking_number && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center flex-wrap">
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">
                      No. Resi:
                    </span>
                    <span className="mr-2 break-all">
                      {order.shipment.tracking_number}
                    </span>
                    <button
                      type="button"
                      onClick={copyTrackingNumber}
                      className="copy-button p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Salin nomor resi"
                    >
                      <Copy size={12} />
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabel Item Pesanan */}
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Rincian Produk
        </h3>
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
          <table className="w-full min-w-[500px] table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Produk</th>
                <th className="px-4 py-2 text-right font-medium">Harga</th>
                <th className="px-4 py-2 text-center font-medium">Jumlah</th>
                <th className="px-4 py-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    {item.product?.product_name || "Produk Dihapus"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-4 py-3 text-center">{item.qty}</td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-300 dark:border-gray-600 font-medium text-gray-800 dark:text-white">
              <tr>
                <td colSpan="3" className="px-4 py-2 text-right">
                  Subtotal Produk
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(order.total_amount)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-2 text-right">
                  Ongkos Kirim
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(order.shipping_cost)}
                </td>
              </tr>
              <tr className="text-lg bg-gray-100 dark:bg-gray-800">
                <td colSpan="3" className="px-4 py-3 text-right font-bold">
                  Grand Total
                </td>
                <td className="px-4 py-3 text-right font-bold">
                  {formatCurrency(order.grand_total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Informasi Pembayaran */}
        {order.payment && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Informasi Pembayaran
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Metode:
              </span>{" "}
              {order.payment.payment_type}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Status:
              </span>{" "}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${paymentStatusInfo?.class}`}
              >
                {paymentStatusInfo?.text}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                ID Transaksi:
              </span>{" "}
              {order.payment.transaction_id || "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
