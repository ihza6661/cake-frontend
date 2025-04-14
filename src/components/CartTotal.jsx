import { useContext } from "react";
import Title from "./Title";
import { AppContext } from "../context/AppContext";

const CartTotal = ({ shippingCost }) => {
  const { currency, cartItems } = useContext(AppContext);

  // Menghitung subtotal dengan memperhitungkan jumlah item (qty)
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.productData.sale_price || item.productData.original_price) *
        item.qty,
    0
  );

  const deliveryFee = shippingCost || 0;
  const total = subtotal + deliveryFee;

  // Fungsi untuk memformat angka menjadi format mata uang Indonesia
  const formatCurrency = (amount) => {
    return (
      currency + amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })
    );
  };

  return (
    <div className="bg-pink-50 dark:bg-gray-900 rounded-2xl sm:rounded-xl p-4 shadow-md">
      <div className="text-xl overflow-hidden">
        <Title text1={"Total"} text2={"Keranjang"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div>
          <p className="font-semibold">Subtotal :</p>
          <ul className="text-gray-700">
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.qty > 1
                  ? `${item.productData.product_name} x${item.qty}`
                  : item.productData.product_name}
              </li>
            ))}
          </ul>
          <p className="font-semibold mt-1">{formatCurrency(subtotal)}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping</p>
          <p>{formatCurrency(deliveryFee)}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b className="pr-2">Total :</b>
          <b>{formatCurrency(total)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
