import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="pt-4 accent dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-16 sm:pt-10 pb-10 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 pr-10">
            <Link to="/">
              <img
                className="w-36 py-0 px-6 mb-4  md:max-w-[200px] bg-pink-50 dark:bg-gray-300 rounded-3xl shadow-sm"
                src="/white.png"
                alt="Yulita Cakes Logo"
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400">
              Kue lezat untuk setiap momen spesial, dibuat dengan cinta dan
              bahan berkualitas terbaik.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-pink-900 dark:text-gray-100">
              Kategori
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Semua Kue
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=birthday"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Kue Ulang Tahun
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=wedding"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Kue Pernikahan
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=custom"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Kue khusus
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-pink-900 dark:text-gray-100">
              Layanan Pelanggan
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Tentang kami
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Kontak
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                >
                  Pengiriman
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-pink-900 dark:text-gray-100">
              Kontak
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
              >
                <Instagram size={20} />
              </a>

              <a
                href="#"
                className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
              >
                <Mail size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Yulita Cakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
