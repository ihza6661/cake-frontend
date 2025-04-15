import { useEffect, useState } from "react";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/user/get_categories");
        if (!response.ok) {
          throw new Error("Gagal memuat data kategori");
        }
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="text-center mb-12">
        <Title text1="Kategori" text2="Kue" />
      </div>

      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          Memuat kategori...
        </p>
      )}
      {error && !loading && (
        <p className="text-center text-red-500 text-lg">
          Terjadi kesalahan: {error}
        </p>
      )}
      {!loading && !error && categories.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          Belum ada kategori tersedia.
        </p>
      )}

      {!loading && !error && categories.length > 0 && (
        <motion.div
          className="mx-auto max-w-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="cursor-pointer group relative flex flex-col items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                onClick={() =>
                  navigate("/kue", {
                    state: { selectedCategory: category.category_name },
                  })
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                aria-label={`Lihat kategori ${category.category_name}`}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mb-3 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={category.image || "/placeholder.jpg"}
                    alt={category.category_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 text-center tracking-wide">
                  {category.category_name}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Categories;
