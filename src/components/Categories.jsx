import { useEffect, useState } from "react";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/user/get_categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-12 px-6 sm:px-12 lg:px-20 xl:px-32">
      {/* Title */}
      <div className="text-center text-3xl font-bold text-gray-800 dark:text-gray-200 mb-10">
        <Title text1="Kategori" text2="Kue" />
      </div>

      {/* Loading & Error Handling */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Memuat kategori...</p>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">
          Terjadi kesalahan saat mengambil data.
        </p>
      ) : (
        <div className="mx-auto max-w-7xl">
          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="cursor-pointer group relative p-5 flex flex-col items-center
              bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl 
              transition-all duration-300 transform hover:-translate-y-1"
                onClick={() =>
                  navigate("/collection", {
                    state: { selectedCategory: category.category_name },
                  })
                }
              >
                {/* Image */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mb-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={`/storage/${category.image}`}
                    alt={category.category_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 text-center tracking-wide">
                  {category.category_name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
