import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import format from "date-fns/format";
import id from "date-fns/locale/id";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { authFetch } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Yulita Cakes - Pesanan";
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await authFetch("/api/user/user_orders");
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [authFetch]);

  return (
    <div className="p-4  rounded-2xl w-full dark:bg-gray-900">
      <h3 className="text-2xl font-semibold mb-6">Pesanan Anda</h3>

      {orders.length === 0 ? (
        <p className="text-center">Anda belum memiliki pesanan.</p>
      ) : (
        <div className="overflow-auto max-h-[400px] rounded-lg">
          <table className="w-full text-left border-collapse min-w-[600px] shadow-md rounded-lg overflow-hidden">
            <thead className="bg-pink-200 dark:bg-pink-700 text-gray-700 dark:text-gray-200 uppercase text-sm">
              <tr>
                <th className="border-b p-4 font-semibold">No. Order</th>
                <th className="border-b p-4 font-semibold">Tanggal</th>
                <th className="border-b p-4 font-semibold text-center">
                  Status
                </th>
                <th className="border-b p-4 font-semibold text-right">Total</th>
                <th className="border-b p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`transition duration-200 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-pink-50 dark:bg-gray-900"
                  } hover:bg-pink-100 dark:hover:bg-pink-800`}
                >
                  <td className="border-b p-4">{order.order_number}</td>
                  <td className="border-b p-4">
                    {format(new Date(order.created_at), "dd MMM yyyy HH:mm", {
                      locale: id,
                    })}
                  </td>
                  <td className="border-b p-4 text-center capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="border-b p-4 text-right font-medium">
                    Rp {Number(order.total_amount).toLocaleString("id-ID")}
                  </td>
                  <td className="border-b p-4 text-center">
                    <button
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
