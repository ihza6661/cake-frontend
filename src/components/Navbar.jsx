import { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { ChevronLeft, Menu as MenuIcon } from "lucide-react";
import { AppContext } from "../context/AppContext";
import DarkModeToggle from "./ui/DarkModeToggle";

const navLinksData = [
  { path: "/", label: "Beranda" },
  { path: "/kue", label: "Kue" },
  { path: "/tentang", label: "Tentang Kami" },
  { path: "/kontak", label: "Kontak" },
];

const Navbar = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { getCartCount, token, handleLogout } = useContext(AppContext);
  const location = useLocation();

  const profileRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSidebarVisible(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 sm:py-3 shadow-md bg-gray-100/80 dark:bg-black/60 backdrop-blur-lg"
          : "py-4 sm:py-4 bg-gray-100/50 dark:bg-black/50"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-serif font-bold"
          aria-label="Beranda Yulita Cakes"
        >
          <h2 className="dark:text-gray-200 text-gray-900">Yulita Cakes</h2>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-lg">
          {navLinksData.map((link) => (
            <NavLink
              to={link.path}
              key={link.path}
              className="relative group py-1"
              end
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`text-gray-800 hover:text-pink-700 dark:text-gray-300 dark:hover:text-pink-400 transition-colors duration-200 ease-in-out font-medium text-base whitespace-nowrap ${
                      isActive ? "text-pink-700 dark:text-pink-400" : ""
                    }`}
                  >
                    {link.label}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-pink-700 dark:bg-pink-400 transition-transform duration-300 ease-in-out transform scale-x-0 group-hover:scale-x-100 origin-center ${
                      isActive ? "scale-x-100" : ""
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <DarkModeToggle />

          <div className="relative flex items-center" ref={profileRef}>
            {token ? (
              <>
                <button
                  type="button"
                  aria-label="Profil Pengguna"
                  onClick={() => setShowProfileDropdown((prev) => !prev)}
                  className="text-xl text-gray-800 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} />
                </button>
                <div
                  className={`absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-150 ease-out transform origin-top-right z-50 ${
                    showProfileDropdown
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <Link
                      to="/dashboard" // Pastikan route ini ada
                      onClick={() => setShowProfileDropdown(false)}
                      className="block px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout("Anda telah logout.");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left block px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      role="menuitem"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/masuk"
                className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 h-9 px-4 py-2"
              >
                Masuk
              </Link>
            )}
          </div>

          <Link
            to="/keranjang"
            className="relative"
            aria-label={`Keranjang Belanja: ${getCartCount()} item`}
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="text-xl text-gray-800 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-400 transition-colors"
            />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 dark:bg-pink-600 text-white text-[10px] font-bold">
                {getCartCount()}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Buka Menu"
            onClick={() => setSidebarVisible(true)}
            className="sm:hidden text-xl text-gray-800 dark:text-gray-300 hover:text-pink-700 dark:hover:text-pink-400 transition-colors"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-y-0 right-0 w-64 md:hidden bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-xl transition-transform duration-300 ease-in-out transform z-[998] ${
          sidebarVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <button
            type="button"
            aria-label="Tutup Menu"
            onClick={() => setSidebarVisible(false)}
            className="flex items-center self-start gap-2 p-2 mb-4 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Kembali</span>
          </button>

          <nav className="flex flex-col gap-1">
            {navLinksData.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md font-medium transition-colors ${
                    isActive
                      ? "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                end
              >
                {link.label}
              </NavLink>
            ))}

            {!token && (
              <Link
                to="/masuk"
                className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 h-10 px-4 py-2"
              >
                Masuk
              </Link>
            )}
          </nav>
        </div>
      </div>
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black/30 z-[997] md:hidden"
          onClick={() => setSidebarVisible(false)}
          aria-hidden="true"
        ></div>
      )}
    </header>
  );
};

Navbar.propTypes = {
  darkModeProps: PropTypes.object
};

export default Navbar;
