import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return; 

    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);
      let url = `/api/user/get_related_products?category_id=${categoryId}`;
      if (currentProductId) {
        url += `&product_id=${currentProductId}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Gagal memuat data produk terkait");
        }
        const data = await response.json();
        setRelatedProducts(data.data || []);
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

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

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="pt-10 pb-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Title text1={"Produk"} text2={"Terkait"} />
          <p className="w-full md:w-3/4 mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Temukan berbagai pilihan kue lainnya yang mungkin Anda suka.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((item) => (
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
      </div>
    </section>
  );
};

RelatedProducts.propTypes = {
  categoryId: PropTypes.number.isRequired,
  currentProductId: PropTypes.number,
};

export default RelatedProducts;
