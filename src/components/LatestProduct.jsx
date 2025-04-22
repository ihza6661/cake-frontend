import { useState, useEffect } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LatestProduct = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/user/get_latest_products");
        if (!response.ok) {
          throw new Error("Gagal memuat data produk terbaru");
        }
        const data = await response.json();
        setLatestProducts(data.data || []);
      } catch (err) {
        console.error("Error fetching latest products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-3">
            Memuat Produk...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-red-500 text-lg">⚠️ {error}</p>
        </motion.div>
      </div>
    );
  }
  if (latestProducts.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-16 bg-pink-50 dark:bg-black">
      <motion.div
        className="container mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Title text1={"Kue"} text2={"Terbaru"} />
        <p className="w-full md:w-3/4 mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-10">
          Temukan koleksi terbaru dari kue lezat kami. Manjakan diri Anda dengan
          rasa yang istimewa! 💕
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {latestProducts.map((item) => (
            <ProductItem
              key={item.id}
              id={item.id}
              image={item.primary_image_url || "/placeholder.jpg"}
              name={item.product_name}
              originalPrice={Number(item.original_price)}
              salePrice={item.sale_price ? Number(item.sale_price) : null}
              slug={item.slug}
              stock={item.stock}
              label={item.label}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/kue">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 h-10 px-6 py-2">
              Lihat Semua Kue
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default LatestProduct;
