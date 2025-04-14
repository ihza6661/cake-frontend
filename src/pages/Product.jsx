import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProductReview from "../components/ProductReview";
// import LatestCollection from "../components/LatestColletion";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { slug } = useParams();
  const { addToCart } = useContext(AppContext);
  const [productData, setProductData] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    document.title = "Yulita Cakes - Produk";
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/api/user/product/${slug}/detail`);
        if (!response.ok) throw new Error("Produk tidak ditemukan.");
        const data = await response.json();
        if (data.product) {
          setProductData(data.product);
          const imageUrls = data.product.images.map(
            (img) => `/storage/${img.image}`
          );
          setImages(imageUrls);
          setSelectedImage(imageUrls[0]);
        } else {
          setProductData(null);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [slug]);

  if (loading)
    return (
      <p className="text-center mt-20 text-pink-400 font-semibold">Memuat...</p>
    );
  if (!productData)
    return (
      <p className="text-center mt-20 text-pink-400 font-semibold">
        Produk tidak ditemukan.
      </p>
    );

  return (
    // <div className="pt-24 sm:pt-36 pb-10 border-t-2">
    <div className="section-padding">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Image Gallery */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex flex-row sm:flex-col gap-4 sm:w-1/5">
              {images.map((item, index) => (
                <img
                  key={index}
                  onClick={() => setSelectedImage(item)}
                  src={item}
                  alt={`Product ${index + 1}`}
                  className="w-20 sm:w-full rounded-lg cursor-pointer border-2 border-transparent hover:border-pink-400 transition"
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                className="w-full rounded-lg shadow-md object-cover border"
                src={selectedImage}
                alt={productData.product_name}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 p-2 sm:p-6 rounded-xl">
            <h1 className="text-2xl sm:text-4xl font-bold mb-3 dark:text-gray-300">
              {productData.product_name}
            </h1>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-semibold font-sans text-gray-700 dark:text-pink-500">
                Rp.{" "}
                {(
                  productData.sale_price ?? productData.original_price
                ).toLocaleString("id-ID")}
              </h3>
              {productData.sale_price !== null &&
                productData.original_price !== productData.sale_price && (
                  <p className="text-lg text-gray-500 line-through">
                    Rp {productData.original_price.toLocaleString("id-ID")}
                  </p>
                )}
            </div>

            <p className="mt-2 text-gray-400 font-medium">
              Stok: <span className="font-semibold">{productData.stock}</span>
            </p>

            <button
              onClick={() => addToCart(productData.id.toString())}
              className="mt-2 bg-gradient-to-r from-pink-500 to-pink-700 text-gray-50 dark:text-gray-200 px-4 py-2 rounded-full hover:bg-pink-500 transition duration-300 ease-in-out hover:shadow-md hover:scale-105 text-sm"
            >
              Tambah ke Keranjang
            </button>

            {/* Description & Reviews */}
            <div className="mt-4 rounded-xl shadow bg-white dark:bg-gray-900 overflow-hidden">
              <div className="flex">
                <button
                  className={`relative px-6 py-3 text-sm font-medium flex-1 transition ${
                    activeTab === "description"
                      ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-pink-900"
                      : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Deskripsi
                </button>
                <button
                  className={`relative px-6 py-3 text-sm font-medium flex-1 transition ${
                    activeTab === "reviews"
                      ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-pink-900"
                      : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Ulasan
                </button>
              </div>

              <div className="p-6">
                {activeTab === "description" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: productData.description,
                    }}
                  />
                ) : (
                  <ProductReview productId={productData.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RelatedProducts category={productData.category_id} />
    </div>
  );
};

export default Product;
