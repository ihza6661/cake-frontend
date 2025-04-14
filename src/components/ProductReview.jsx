import { useState, useEffect, useContext } from "react";
import { FaStar } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Title from "./Title";


const ProductReview = ({ productId }) => {
  const { authFetch, token } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [eligible, setEligible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authFetch("/api/user/get_user", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    if (token) {
      fetchUserProfile();
    }
  }, [authFetch, token]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await authFetch(
          `/api/user/product/${productId}/reviews`,
          { method: "GET", headers: { Accept: "application/json" } }
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [authFetch, productId]);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const response = await authFetch(
          `/api/user/product/${productId}/review-eligibility`,
          { method: "GET", headers: { Accept: "application/json" } }
        );
        if (response.ok) {
          const data = await response.json();
          setEligible(data.eligible);
        } else {
          setEligible(false);
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error);
        setEligible(false);
      }
    };
    if (token) {
      checkEligibility();
    }
  }, [authFetch, productId, token]);

  return (
    <div className="rounded-lg p-2">
        <Title text1={"Ulasan"} text2={"Produk"} />
      
      {/* <h3 className="text-lg font-bold text-pink-600 mb-4">🍰 Ulasan Produk</h3> */}
      {token && eligible && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mb-6 bg-white p-4 rounded-lg shadow"
        >
          <h3 className="text-xl font-semibold mb-3">Berikan Rating Anda</h3>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}>
                <FaStar
                  className={`text-3xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            className="w-full border border-pink-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500"
            placeholder="Ceritakan pengalaman Anda dengan produk ini..."
            rows="4"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-2 rounded-full mt-3 hover:bg-pink-600 transition-all"
          >
            Kirim Review
          </button>
        </form>
      )}
      <div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-xl ${
                      review.rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600">
                  {review.user?.name || "Anonim"}
                </span>
              </div>
              <p className="text-gray-800">{review.review}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReview;
