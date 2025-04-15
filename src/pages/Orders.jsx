import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import { format } from "date-fns/format";
import { id } from "date-fns/locale/id";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const Orders = () => {
  const { authFetch, currency } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Yulita Cakes - Pesanan Saya";
  }, []);

  const fetchOrders = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authFetch(`/api/user/orders?page=${page}`);
        if (!response) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setOrders(data.data || []);
          setPagination({ links: data.links, meta: data.meta });
        } else {
          throw new Error(data.message || "Gagal mengambil data pesanan.");
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error fetching orders:", error);
          setError("Gagal memuat pesanan. Coba lagi nanti.");
          toast.error(
            error.message || "Terjadi kesalahan saat mengambil data pesanan."
          );
        }
        setOrders([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [authFetch]
  );

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handlePageChange = (url) => {
    if (url) {
      try {
        const pageNumber = new URL(url).searchParams.get("page");
        if (pageNumber) {
          fetchOrders(pageNumber);
        }
      } catch (e) {
        console.error("Error parsing pagination URL:", e);
      }
    }
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

  return (
    <div className="p-4 md:p-6 rounded-lg bg-white dark:bg-gray-900 shadow-sm w-full min-h-[400px]">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Pesanan Saya
      </h3>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-10">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Anda belum memiliki pesanan.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">No. Order</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => {
                  const statusInfo = formatStatus(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        #{order.order_number}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {format(
                          new Date(order.order_date),
                          "dd MMM yyyy HH:mm",
                          { locale: id }
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}
                        >
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800 dark:text-gray-200">
                        {currency}
                        {Number(order.grand_total).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/pesanan/${order.id}`)
                          }
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs"
                          title="Lihat Detail Pesanan"
                        >
                          <Eye className="w-3 h-3" /> Lihat
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && pagination.meta && pagination.meta.last_page > 1 && (
            <div className="mt-6 flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Halaman {pagination.meta.current_page} dari{" "}
                {pagination.meta.last_page}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.links?.prev)}
                  disabled={!pagination.links?.prev || isLoading}
                  className="inline-flex items-center px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
                </button>
                <button
                  onClick={() => handlePageChange(pagination.links?.next)}
                  disabled={!pagination.links?.next || isLoading}
                  className="inline-flex items-center px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                >
                  Berikutnya <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
