import { useContext, useEffect, useState, useCallback } from "react";
import Title from "../components/Title";
import { useLocation } from "react-router-dom";
import ProductItem from "../components/ProductItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "@/context/AppContextObject";
import { motion } from "framer-motion";

const Product = () => {
  const { search } = useContext(AppContext);
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sortType, setSortType] = useState("created_at-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  useEffect(() => {
    document.title = "Brownies Squishy - Koleksi Kue";
  }, []);

  useEffect(() => {
    const categoryFromState = location.state?.selectedCategory;
    if (categoryFromState && categories.length > 0) {
      const foundCategory = categories.find(
        (cat) => cat.category_name === categoryFromState
      );
      setSelectedCategoryId(foundCategory ? foundCategory.id : null);
      window.history.replaceState({}, document.title);
    } else if (!location.state?.selectedCategory) {
      setSelectedCategoryId(null);
    }
  }, [location.state, categories]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/user/get_categories`);
      if (!response.ok) throw new Error("Gagal memuat kategori");
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchProducts = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        // Bangun query string
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (selectedCategoryId) {
          params.append("category_id", selectedCategoryId.toString());
        }
        if (search) {
          params.append("search", search);
        }
        if (sortType) {
          const [sortBy, sortDir] = sortType.split("-");
          params.append("sort_by", sortBy);
          params.append("sort_dir", sortDir);
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/get_products?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error("Gagal memuat data produk");
        }
        const data = await response.json();

        if (Array.isArray(data.data)) {
          setProducts(data.data);
          setPaginationMeta({
            currentPage: data.meta?.current_page,
            lastPage: data.meta?.last_page,
            total: data.meta?.total,
            from: data.meta?.from,
            to: data.meta?.to,
          });
          setCurrentPage(data.meta?.current_page || 1);
        } else {
          console.error("Format data produk tidak sesuai:", data);
          throw new Error("Format data produk tidak sesuai");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setProducts([]);
        setPaginationMeta(null);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategoryId, sortType, search]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId((prevId) =>
      prevId === categoryId ? null : categoryId
    );
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (paginationMeta && currentPage < paginationMeta.lastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (paginationMeta && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 pt-24 pb-16"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full md:w-64 lg:w-72 flex-shrink-0"
        >
          <div className="sticky top-24 p-1">
            {" "}
            {/* Sticky sidebar */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Filter
              </h2>
              <button
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
                aria-label={showFilterSidebar ? "Tutup Filter" : "Buka Filter"}
              >
                {showFilterSidebar ? (
                  <FontAwesomeIcon icon={faTimes} />
                ) : (
                  <FontAwesomeIcon icon={faArrowRight} />
                )}
              </button>
            </div>
            {/* Konten Filter (conditionally rendered di mobile) */}
            <motion.div
              initial={false}
              animate={
                showFilterSidebar || window.innerWidth >= 768
                  ? "open"
                  : "closed"
              }
              variants={{
                open: {
                  opacity: 1,
                  height: "auto",
                  overflow: "visible",
                  transition: { duration: 0.3 },
                },
                closed: {
                  opacity: 0,
                  height: 0,
                  overflow: "hidden",
                  transition: { duration: 0.3 },
                },
              }}
              className={`bg-gray-50 dark:bg-gray-900/70 p-5 rounded-lg shadow-sm ${
                showFilterSidebar ? "block" : "hidden md:block"
              }`}
            >
              <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-3">
                Kategori
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
                {/* Tombol Reset Kategori */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="categoryFilter"
                    className="w-4 h-4 accent-pink-600 cursor-pointer"
                    checked={selectedCategoryId === null}
                    onChange={() => handleCategoryChange(null)} // Set ke null untuk reset
                  />
                  <span
                    className={`hover:text-pink-700 dark:hover:text-pink-400 transition-colors ${
                      selectedCategoryId === null
                        ? "font-semibold text-pink-700 dark:text-pink-400"
                        : ""
                    }`}
                  >
                    Semua Kategori
                  </span>
                </label>
                {/* Daftar Kategori */}
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="categoryFilter"
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                      value={cat.id}
                      checked={selectedCategoryId === cat.id}
                      onChange={() => handleCategoryChange(cat.id)}
                    />
                    <span
                      className={`hover:text-pink-700 dark:hover:text-pink-400 transition-colors ${
                        selectedCategoryId === cat.id
                          ? "font-semibold text-pink-700 dark:text-pink-400"
                          : ""
                      }`}
                    >
                      {cat.category_name}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.aside>

        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-1">
            {/* Title dipindah ke sini */}
            <div className="mb-4 sm:mb-0">
              <Title
                text1={
                  selectedCategoryId
                    ? categories.find((c) => c.id === selectedCategoryId)
                        ?.category_name || "Koleksi"
                    : "Semua"
                }
                text2={"Kue 🍰"}
              />
              {paginationMeta && paginationMeta.total > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Menampilkan {paginationMeta.from}-{paginationMeta.to} dari{" "}
                  {paginationMeta.total} produk
                </p>
              )}
            </div>

            <select
              value={sortType}
              onChange={handleSortChange}
              className="text-sm px-2 py-2 w-48 h-10 rounded-md 
            bg-accent dark:bg-gray-900 shadow-md"
              aria-label="Urutkan produk"
            >
              <option value="created_at-desc">Terbaru</option>
              <option value="product_name-asc">Nama (A-Z)</option>
              <option value="product_name-desc">Nama (Z-A)</option>
              <option value="original_price-asc">Harga Terendah</option>
              <option value="original_price-desc">Harga Tertinggi</option>
            </select>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-96 text-center">
              <p className="text-red-500 text-lg">⚠️ {error}</p>
            </div>
          ) : products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {products.map((item) => (
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
            </motion.div>
          ) : (
            <div className="flex justify-center items-center h-64 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Tidak ada produk yang cocok dengan filter Anda.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {paginationMeta && paginationMeta.lastPage > 1 && (
            <div className="mt-10 flex justify-center items-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300"
              >
                Sebelumnya
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-400">
                Halaman {currentPage} dari {paginationMeta.lastPage}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === paginationMeta.lastPage || isLoading}
                className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300"
              >
                Berikutnya
              </button>
            </div>
          )}
        </motion.main>
      </div>
    </motion.div>
  );
};

export default Product;