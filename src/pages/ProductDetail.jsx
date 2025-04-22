import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProductReview from "../components/ProductReview";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronLeft } from "lucide-react";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useContext(AppContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    document.title = "Yulita Cakes - Memuat Produk...";
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      setProductData(null);
      try {
        const response = await fetch(`/api/user/product/${slug}/detail`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Produk tidak ditemukan.");
          }
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            /* Abaikan */
            console.log("Error parsing error response:", e);
            
          }
          throw new Error(errorData?.message || "Gagal memuat data produk.");
        }
        const data = await response.json();

        if (data.data) {
          setProductData(data.data);
          setSelectedImage(
            data.data.primary_image_url ||
              data.data.images?.[0]?.image_url ||
              "/placeholder.jpg"
          );
          document.title = `Yulita Cakes - ${data.data.product_name}`;
        } else {
          throw new Error("Format data produk tidak sesuai.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        if (
          error.message !== "Unauthorized" &&
          error.message !== "User not authenticated"
        ) {
          setError(error.message);
        } else {
          setError("Anda perlu login untuk melihat produk ini.");
        }
        document.title = "Yulita Cakes - Error";
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    } else {
      setError("Slug produk tidak valid.");
      setLoading(false);
    }
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (productData && productData.stock > 0) {
      addToCart(productData.id, null, 1);
    } else if (productData && productData.stock === 0) {
      toast.warn("Maaf, stok produk ini sedang habis.", {
        position: "bottom-center",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-center text-lg text-gray-500 dark:text-gray-400">
            Memuat data produk...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center px-4">
        <p className="text-red-500 text-xl mb-4">⚠️ {error}</p>
        <Link
          to="/kue"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          <ChevronLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Kembali ke Koleksi
        </Link>
      </div>
    );

  if (!productData)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <p className="text-gray-500 dark:text-gray-400 text-xl">
          Produk tidak tersedia.
        </p>
      </div>
    );

  const hasDiscount =
    productData.sale_price !== null &&
    productData.sale_price > 0 &&
    Number(productData.sale_price) < Number(productData.original_price);
  const effectivePrice = hasDiscount
    ? productData.sale_price
    : productData.original_price;
  const isOutOfStock = productData.stock === 0;

  return (
    <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/kue"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Kembali ke Koleksi
          </Link>
        </div>

        <motion.div
          className="flex flex-col lg:flex-row gap-8 md:gap-12 bg-white dark:bg-gray-900 p-4 md:p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-1/2 flex-shrink-0">
            {productData.images && productData.images.length > 1 && (
              <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-hidden md:w-20 p-2 md:pb-0 flex-shrink-0">
                {productData.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={` image-contain p-1 flex-shrink-0 w-16 h-16 md:w-full md:h-auto aspect-square rounded-md cursor-pointer border-2 transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                      selectedImage === img.image_url
                        ? "border-pink-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    aria-label={`Lihat gambar ${img.id}`}
                  >
                    <img
                      src={img.image_url}
                      alt={`Thumbnail ${productData.product_name}`}
                      className="w-full h-full object-cover rounded-md"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 aspect-square overflow-hidden rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
              <img
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                src={selectedImage || "/placeholder.jpg"}
                alt={productData.product_name}
              />
            </div>
          </div>

          <div className="flex-1 lg:w-1/2">
            <h1 className="text-3xl lg:text-4xl font-bold font-serif mb-3 text-gray-900 dark:text-gray-100">
              {productData.product_name}
            </h1>
            {productData.category && (
              <Link
                to="/kue"
                state={{ selectedCategory: productData.category.category_name }}
                className="text-sm text-pink-600 dark:text-pink-400 hover:underline mb-4 inline-block"
              >
                {productData.category.category_name}
              </Link>
            )}
            <div className="flex items-center gap-3 mb-4">
              <p className="text-3xl font-semibold font-sans text-pink-700 dark:text-pink-400">
                Rp {Number(effectivePrice).toLocaleString("id-ID")}
              </p>
              {hasDiscount && (
                <p className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  Rp{" "}
                  {Number(productData.original_price).toLocaleString("id-ID")}
                </p>
              )}
            </div>
            <p
              className={`mb-5 text-sm font-medium ${
                isOutOfStock
                  ? "text-red-500"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {isOutOfStock
                ? "Stok Habis"
                : `Stok Tersedia: ${productData.stock}`}
            </p>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || loading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                isOutOfStock
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800"
              }`}
            >
              <ShoppingBag size={20} />
              {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
            </button>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "description"}
                  onClick={() => setActiveTab("description")}
                  className={`relative px-5 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-1 rounded-t-md ${
                    activeTab === "description"
                      ? "text-pink-600 dark:text-pink-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-pink-600 dark:after:bg-pink-400"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  Deskripsi
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "reviews"}
                  onClick={() => setActiveTab("reviews")}
                  className={`relative px-5 py-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-1 rounded-t-md ${
                    activeTab === "reviews"
                      ? "text-pink-600 dark:text-pink-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-pink-600 dark:after:bg-pink-400"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  Ulasan
                </button>
              </div>
              <div className="p-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[100px]">
                {activeTab === "description" ? (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        productData.description ||
                        "<p>Deskripsi tidak tersedia.</p>",
                    }}
                  />
                ) : (
                  <ProductReview productId={productData.id} />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {productData.category && (
        <RelatedProducts
          categoryId={productData.category.id}
          currentProductId={productData.id}
        />
      )}
    </div>
  );
};

export default ProductDetail;
