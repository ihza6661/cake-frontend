import { useState, useEffect } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/get_latest_products");
        if (!response.ok) {
          throw new Error("Gagal memuat data produk");
        }
        const data = await response.json();
        const productsWithImages = data
          .filter((product) =>
            product.images.some((img) => img.is_primary === 1)
          )
          .map((product) => {
            const primaryImage = product.images.find(
              (img) => img.is_primary === 1
            );
            return {
              id: product.id,
              name: product.product_name,
              original_price: product.original_price,
              sale_price: product.sale_price,
              image: `/storage/${primaryImage.image}`,
              slug: product.slug,
              stock: product.stock,
              label: product.label,
            };
          });
        setLatestProducts(productsWithImages.slice(0, 10));
      } catch (err) {
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
          <p className="text-xl text-gray-500 mt-3">Memuat Produk...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            className="text-red-500 text-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1.1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            ⚠️ {error}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="section-padding">
      {/* Judul Koleksi Terbaru */}
      <motion.div
        className="container mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Title text1={"Kue"} text2={"Terbaru"} />
        <p className="w-3/4 mx-auto text-sm sm:text-base font-medium pb-4">
          Temukan koleksi terbaru dari kue lezat kami. Manjakan diri Anda dengan
          rasa yang istimewa! 💕
        </p>

        {/* Daftar Produk Terbaru */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 md:gap-x-6 px-4 sm:py-10">
          {latestProducts.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group relative  rounded-2xl transition-transform"
            >
              <ProductItem
                id={item.id}
                image={item.image}
                name={item.name}
                originalPrice={item.original_price}
                salePrice={item.sale_price}
                slug={item.slug}
                stock={item.stock}
                label={item.label}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link to="/collection">
            <Button className="py-2 px-4 rounded-full">Lihat Semua Kue</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default LatestCollection;
