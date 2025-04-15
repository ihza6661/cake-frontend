import { useContext } from "react";
import PropTypes from "prop-types";
import Title from "./Title";
import { AppContext } from "../context/AppContext";

const CartTotal = ({ shippingCost = 0, includeItemList = false }) => {
  const { currency, cartItems } = useContext(AppContext);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product ? Number(item.product.effective_price) || 0 : 0;
    return sum + price * item.qty;
  }, 0);
  
  const weightTotal = cartItems.reduce((sum, item) => {
    const weight = item.product ? Number(item.product.weight) || 0 : 0;
    return sum + weight * item.qty;
  }, 0);

  const deliveryFee = Number(shippingCost) || 0;
  const total = subtotal + deliveryFee;

  const formatCurrency = (amount) => {
    return (
      currency + amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <Title text1={"Total"} text2={"Pesanan"} />
      </div>
      <div className="flex flex-col gap-3 text-sm">
        {includeItemList && cartItems.length > 0 && (
          <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
            <p className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Item:
            </p>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto text-xs pr-2">
              {cartItems.map((item) => (
                <li key={item.cart_item_id} className="flex justify-between">
                  <span>
                    {item.product?.product_name || "N/A"}{" "}
                    <span className="text-gray-500">x{item.qty}</span>
                  </span>
                  <span>
                    {formatCurrency(
                      (item.product
                        ? Number(item.product.effective_price) || 0
                        : 0) * item.qty
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <p>Subtotal</p>
          <p className="font-medium">{formatCurrency(subtotal)}</p>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <p>Total Berat</p>
          <p className="font-medium">{weightTotal} GRAM</p>
        </div>

        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <p>Ongkos Kirim</p>
          <p className="font-medium">
            {deliveryFee > 0 ? formatCurrency(deliveryFee) : "Dihitung nanti"}
          </p>
        </div>

        <hr className="border-gray-200 dark:border-gray-700 my-2" />

        <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <p>Total</p>
          <p>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  );
};

CartTotal.propTypes = {
  shippingCost: PropTypes.number,
  includeItemList: PropTypes.bool,
};

export default CartTotal;
