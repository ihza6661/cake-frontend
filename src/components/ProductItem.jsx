import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContextObject";
import { toast } from "react-toastify";

const ProductItem = ({
  image = "/placeholder.jpg",
  name = "Unknown Product",
  originalPrice = 0,
  salePrice = null,
  slug = null,
  stock = 1,
  label = null,
  id, 
}) => {
  const isOutOfStock = stock === 0;
  const hasDiscount =
    salePrice !== null && salePrice > 0 && salePrice < originalPrice;
  const effectivePrice = hasDiscount ? salePrice : originalPrice;

  const { addToCart } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      addToCart(id, null, 1);
    } else {
      console.error("Product ID is missing for Add to Cart");
      toast.error("Gagal menambahkan ke keranjang: ID produk tidak ditemukan.");
    }
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (slug) {
      navigate(`/kue/${slug}`);
    }
  };

  const productContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-transparent dark:border-gray-800"
    >
      <div className="overflow-hidden relative aspect-square">
        {/* Tombol View Detail on Hover */}
        <button
          onClick={handleNavigate}
          aria-label={`Lihat detail ${name}`}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          disabled={!slug}
        >
          <span className="text-white text-sm font-semibold border border-white rounded-full px-3 py-1">
            Lihat Detail
          </span>
        </button>
        {/* Gambar Produk */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={image || "/placeholder.jpg"}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="text-white font-bold text-base px-4 py-1 bg-red-600 rounded">
              Stok Habis
            </span>
          </div>
        )}
        {/* Tombol Add to Cart on Hover */}
        {!isOutOfStock && (
          <button
            type="button"
            aria-label={`Tambah ${name} ke keranjang`}
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 z-20 bg-pink-600 hover:bg-pink-700 text-white rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            <ShoppingBag size={16} />
          </button>
        )}
        {/* Label Produk */}
        {label && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
            {label}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-semibold font-serif text-gray-900 dark:text-gray-100 tracking-wide mb-1 truncate">
          {name}
        </h3>
        <div className="mt-auto flex items-end justify-between">
          <div className="text-left">
            {hasDiscount ? (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                  Rp {originalPrice.toLocaleString("id-ID")}
                </p>
                <p className="text-lg font-bold text-pink-700 dark:text-pink-400">
                  Rp {salePrice.toLocaleString("id-ID")}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-pink-700 dark:text-pink-400">
                Rp {effectivePrice.toLocaleString("id-ID")}
              </p>
            )}
          </div>
          {/* <p className={`text-xs font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                         {isOutOfStock ? 'Habis' : 'Tersedia'}
                      </p> */}
        </div>
      </div>
    </motion.div>
  );

  if (!slug) {
    return <div className="w-full h-full">{productContent}</div>;
  }

  return (
    <Link
      to={`/kue/${slug}`}
      className="block w-full h-full"
      aria-label={`Lihat kue ${name}`}
    >
      {productContent}
    </Link>
  );
};

ProductItem.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  originalPrice: PropTypes.number.isRequired,
  salePrice: PropTypes.number,
  slug: PropTypes.string,
  stock: PropTypes.number.isRequired,
  label: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProductItem;
