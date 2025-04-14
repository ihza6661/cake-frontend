import { useContext, useEffect, useState } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { AppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useContext(AppContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10 bg-pink-50 py-10 rounded-lg">
      <div className="text-center py-6">
        <Title text1={"🍩 PRODUK"} text2={"TERLARIS 🎂"} />
        <p className="w-3/4 mx-auto text-sm sm:text-base text-pink-700 font-medium">
          Nikmati pilihan kue terbaik yang paling disukai pelanggan kami!
          Dijamin lezat dan menggoda! 💕
        </p>
      </div>

      {/* Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
        {bestSeller.map((item, index) => (
          <div
            key={index}
            className="transform hover:scale-105 transition-transform duration-300 ease-in-out bg-white rounded-xl p-4 shadow-md"
          >
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
