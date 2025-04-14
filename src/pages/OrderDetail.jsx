import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const OrderDetail = () => {
  useEffect(() => {
    document.title = "Yulita Cakes - Detil Order";
  }, []);

  const { authFetch } = useContext(AppContext);
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await authFetch(`/api/user/user_orders/${orderId}`);
        const data = await response.json();
        if (response.ok) {
          setOrder(data);
        } else {
          console.error("Failed to fetch order:", data.message);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [authFetch, orderId]);

  if (!order) {
    return <p className="text-center mt-10">Memuat detail pesanan...</p>;
  }

  const copyTrackingNumber = () => {
    if (order.shipment?.tracking_number) {
      navigator.clipboard.writeText(order.shipment.tracking_number);
      toast.success("Nomor resi berhasil disalin"),
        { className: "toast-custom" };
    }
  };

  const downloadInvoice = () => {
    const invoice = document.getElementById("invoice");
    if (!invoice) return;

    // Tambahkan nama toko secara dinamis (hanya untuk hasil download)
    const storeNameEl = document.createElement("div");
    storeNameEl.textContent = "Yulita Cakes";
    storeNameEl.className = "text-center text-3xl font-bold mb-4";
    invoice.insertBefore(storeNameEl, invoice.firstChild);

    // Sembunyikan tombol copy (jika ada) dari hasil download
    const copyButton = invoice.querySelector(".copy-button");
    let originalDisplay = "";
    if (copyButton) {
      originalDisplay = copyButton.style.display;
      copyButton.style.display = "none";
    }

    html2canvas(invoice)
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = `invoice_${order.order_number}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
      .finally(() => {
        // Hapus nama toko dari invoice setelah capture
        invoice.removeChild(storeNameEl);
        // Kembalikan tombol copy ke tampilan semula
        if (copyButton) {
          copyButton.style.display = originalDisplay;
        }
      })
      .catch((err) => {
        console.error("Gagal mengunduh gambar:", err);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Download Button */}

      <Button onClick={downloadInvoice} className="flex items-center gap-2">
        <Download size={16} />
        Unduh Nota
      </Button>

      {/* Invoice Container */}
      <div id="invoice">
        {/* Order Header */}
        <div className="bg-pink-50 dark:bg-gray-900 shadow rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            Detail Pesanan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm md:text-lg break-words">
                <span className="font-semibold">No. Order:</span>{" "}
                {order.order_number}
              </p>
              <p className="text-sm md:text-lg">
                <span className="font-semibold">Tanggal:</span>{" "}
                {format(new Date(order.created_at), "dd MMM yyyy HH:mm", {
                  locale: id,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm md:text-lg break-words">
                <span className="font-semibold">Status:</span> {order.status}
              </p>
              <p className="text-sm md:text-lg break-words">
                <span className="font-semibold">Total:</span> Rp{" "}
                {Number(order.total_amount).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        {order.shipment && (
          <div className="bg-pink-50 dark:bg-gray-900 shadow rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              Detail Pengiriman
            </h3>
            <div className="space-y-2">
              <p className="text-sm md:text-lg">
                <span className="font-semibold">Kurir:</span>{" "}
                {order.shipment.courier}
              </p>
              <p className="text-sm md:text-lg">
                <span className="font-semibold">Layanan:</span>{" "}
                {order.shipment.service}
              </p>
              <p className="text-sm md:text-lg flex flex-wrap items-center">
                <span className="font-semibold">Nomor Resi:</span>
                {order.shipment.tracking_number ? (
                  <span className="ml-2 flex flex-wrap items-center break-all">
                    {order.shipment.tracking_number}
                    <button
                      onClick={copyTrackingNumber}
                      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs copy-button"
                    >
                      Copy
                    </button>
                  </span>
                ) : (
                  <span className="ml-2">Belum tersedia</span>
                )}
              </p>
              <p className="text-sm md:text-lg">
                <span className="font-semibold">Biaya Pengiriman:</span> Rp{" "}
                {Number(order.shipment.shipping_cost).toLocaleString("id-ID")}
              </p>
              <p className="text-sm md:text-lg">
                <span className="font-semibold">Status Pengiriman:</span>{" "}
                {order.shipment.status}
              </p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-pink-50 dark:bg-gray-900 shadow rounded-lg p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            Produk Pesanan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-pink-100 dark:bg-gray-800">
                  <th className="border p-2 md:p-3 text-left">Produk</th>
                  <th className="border p-2 md:p-3 text-left">Harga</th>
                  <th className="border p-2 md:p-3 text-left">Jumlah</th>
                  <th className="border p-2 md:p-3 text-left">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2 md:p-3 break-words">
                      {item.product.product_name}
                    </td>
                    <td className="border p-2 md:p-3">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </td>
                    <td className="border p-2 md:p-3">{item.qty}</td>
                    <td className="border p-2 md:p-3">
                      Rp {Number(item.price * item.qty).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
