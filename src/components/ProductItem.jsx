import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const ProductItem = ({
  image = "/placeholder.jpg",
  name = "Unknown Product",
  originalPrice = 0,
  salePrice = null,
  slug = null,
  stock = 1,
  label = null,
}) => {
  const isOutOfStock = stock === 0;
  const hasDiscount = salePrice !== null && salePrice < originalPrice;

  // const discountPercentage = hasDiscount
  //   ? (((originalPrice - salePrice) / originalPrice) * 100).toFixed(0)
  //   : 0;

  const productContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative accent rounded-2xl overflow-hidden shadow-md transition-shadow flex flex-col"
    >
      {/* Product Image */}
      <div className=" overflow-hidden relative">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Stok Habis</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h3 className=" text-start font-serif text-lg font-medium text-gray-900 dark:text-gray-100 tracking-wide">
          {name}
        </h3>

        {/* Pricing */}
        <div className="mt-2 flex items-center justify-between">
          {hasDiscount ? (
            <div className="text-start">
              <p className="text-xs text-gray-500 dark:text-gray-600 line-through">
                Rp.{" "}
                {originalPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-lg md:text-xl font-bold text-pink-900 dark:text-pink-400">
                Rp.{" "}
                {salePrice.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          ) : (
            <p className="text-lg md:text-xl font-bold text-pink-900">
              Rp.{" "}
              {originalPrice.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <p className=" text-end text-xs  text-gray-800 dark:text-gray-200">
            {label}
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      {!isOutOfStock && (
        <div className="absolute bottom-16 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `${`/product/${slug}`}`;
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            <ShoppingBag size={16} />
          </Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="w-full">
      {slug ? (
        <Link to={`/product/${slug}`} className="block">
          {productContent}
        </Link>
      ) : (
        productContent
      )}
    </div>
  );
};

ProductItem.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  originalPrice: PropTypes.number,
  salePrice: PropTypes.number,
  slug: PropTypes.string,
  stock: PropTypes.number,
  label: PropTypes.string,
};

export default ProductItem;
