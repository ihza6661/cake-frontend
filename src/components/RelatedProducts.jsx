import { useState, useEffect } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RelatedProducts = ({ category, subCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Category yang diterima:", category);
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `/api/user/get_related_products?category_id=${category}`
        );
        if (!response.ok) {
          throw new Error("Gagal memuat data produk terkait");
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
            };
          });

        setRelatedProducts(productsWithImages.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category]);

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
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <Title text1={"Produk"} text2={"Terkait"} />
          <p className="w-3/4 mx-auto text-sm sm:text-base font-medium">
            Temukan berbagai pilihan kue lainnya.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 md:gap-x-6 px-4 sm:pt-6">
          {relatedProducts.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl transition-transform"
            >
              <ProductItem
                id={item.id}
                image={item.image}
                name={item.name}
                originalPrice={item.original_price}
                salePrice={item.sale_price}
                slug={item.slug}
                stock={item.stock}
              />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/collection">
            <Button className="py-2 px-4 rounded-full">Lihat Semua Kue</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
