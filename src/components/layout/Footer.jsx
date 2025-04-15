import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/user/get_categories");
        if (!response.ok) {
          throw new Error("Gagal memuat kategori");
        }
        const data = await response.json();
        setCategories(data?.data ?? []);
      } catch (err) {
        console.error("Error fetching footer categories:", err);
        setError("Gagal memuat kategori.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []); 

  const handleCategoryClick = (categoryName) => {
    navigate("/kue", { state: { selectedCategory: categoryName } });
    window.scrollTo(0, 0);
  };

  return (
    <footer className="pt-10 pb-8 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="md:col-span-1">
            <Link to="/">
            {" "}
              <img
                className="w-36 py-0 px-6 mb-4  md:max-w-[200px] bg-pink-50 dark:bg-gray-300 rounded-3xl shadow-sm"
                src="/white.png"
                alt="Yulita Cakes Logo"
              />
              {" "}
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Kue lezat untuk setiap momen spesial, dibuat dengan cinta dan
              bahan berkualitas terbaik di Pontianak.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-serif font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Kategori Kue
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/kue"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Semua Kue
                </Link>
              </li>
              {isLoading ? (
                <li>
                  <span className="text-gray-400 dark:text-gray-500 italic">
                    Memuat...
                  </span>
                </li>
              ) : error ? (
                <li>
                  <span className="text-red-500 text-xs">{error}</span>
                </li>
              ) : (
                categories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() =>
                        handleCategoryClick(category.category_name)
                      }
                      className="text-left text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                    >
                      {category.category_name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-serif font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Informasi
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/tentang"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/kontak"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-serif font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Hubungi Kami
            </h3>
            {/* Ganti '#' dengan link asli */}
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.instagram.com/cakesyulita"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Yulita Cakes"
                className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:cakesyulita57@gmail.com"
                aria-label="Email Yulita Cakes"
                className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://wa.me/6289603324917"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Whatsapp Yulita Cakes"
                className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-whatsapp"
                  viewBox="0 0 16 16"
                >
                  {" "}
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />{" "}
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Yulita Cakes Pontianak. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
