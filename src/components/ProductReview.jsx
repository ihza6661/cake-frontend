import { useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Title from "./Title";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Star,
  Edit,
  Trash2,
  Send,
  X,
  Loader2,
  Info,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const ProductReview = ({ productId }) => {
  const { authFetch, token } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const [eligibilityReason, setEligibilityReason] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const response = await authFetch("/api/user");
      if (!response) {
        setCurrentUser(null);
        return;
      }
      const data = await response.json();
      if (response.ok && data?.data) {
        setCurrentUser(data.data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error fetching user profile:", error);
      }
      setCurrentUser(null);
    }
  }, [token, authFetch]);

  const fetchReviews = useCallback(
    async (page = 1) => {
      setReviewLoading(true);
      setReviewError(null);
      try {
        const response = await fetch(
          `/api/user/products/${productId}/reviews?page=${page}`
        );
        if (!response.ok) {
          throw new Error(`Gagal memuat ulasan (${response.status})`);
        }
        const data = await response.json();
        setReviews(data?.data ?? []);
        setPaginationMeta(data?.meta ?? null);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviewError(
          error.message || "Terjadi kesalahan saat memuat ulasan."
        );
        setReviews([]);
        setPaginationMeta(null);
      } finally {
        setReviewLoading(false);
      }
    },
    [productId]
  );

  const checkEligibility = useCallback(async () => {
    if (!token) {
      setCanReview(false);
      setHasReviewed(false);
      setEligibilityLoading(false);
      setEligibilityReason("unauthenticated");
      return;
    }
    setEligibilityLoading(true);
    setEligibilityReason(null);
    try {
      const response = await authFetch(
        `/api/user/products/${productId}/review-eligibility`
      );
      if (!response) {
        setEligibilityLoading(false);
        return;
      }
      const data = await response.json();
      if (response.ok) {
        setCanReview(data?.can_review ?? false);
        setHasReviewed(data?.has_reviewed ?? false);
        setEligibilityReason(data?.reason ?? null);
      } else {
        setCanReview(false);
        setHasReviewed(false);
        setEligibilityReason(data?.message ?? "error");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error checking eligibility:", error);
      }
      setCanReview(false);
      setHasReviewed(false);
      setEligibilityReason("error");
    } finally {
      setEligibilityLoading(false);
    }
  }, [authFetch, productId, token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  useEffect(() => {
    fetchReviews(1);
    checkEligibility();
  }, [fetchReviews, checkEligibility]);

  const handleStarClick = (index) => setRating(index);
  const handleStarHover = (index) => setHoverRating(index);
  const handleReviewTextChange = (e) => setReviewText(e.target.value);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warn("Rating bintang wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await authFetch(
        `/api/user/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ rating: rating, review: reviewText }),
        }
      );
      if (!response) {
        setIsSubmitting(false);
        return;
      }
      const data = await response.json();
      if (response.ok || response.status === 201) {
        toast.success(data?.message || "Review berhasil ditambahkan.");
        setRating(0);
        setReviewText("");
        fetchReviews(1);
        checkEligibility();
      } else {
        const firstError = data?.errors
          ? Object.values(data.errors)[0]?.[0]
          : null;
        toast.error(firstError || data?.message || "Gagal mengirim review.");
        if (response.status === 409 || response.status === 403) {
          checkEligibility();
        }
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error submitting review:", error);
        toast.error("Terjadi kesalahan saat mengirim review.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStarClick = (index) => setEditRating(index);
  const handleEditStarHover = (index) => setEditHoverRating(index);
  const handleEditTextChange = (e) => setEditText(e.target.value);
  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditText(review.review ?? "");
    setEditHoverRating(0);
  };
  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (editRating === 0) {
      toast.warn("Rating bintang wajib diisi.");
      return;
    }
    if (!editingReviewId) return;
    setIsUpdating(true);
    try {
      const response = await authFetch(`/api/user/reviews/${editingReviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ rating: editRating, review: editText }),
      });
      if (!response) {
        setIsUpdating(false);
        return;
      }
      const data = await response.json();
      if (response.ok) {
        toast.success(data?.message || "Review berhasil diperbarui.");
        fetchReviews(paginationMeta?.current_page || 1);
        handleCancelEdit();
      } else {
        const firstError = data?.errors
          ? Object.values(data.errors)[0]?.[0]
          : null;
        toast.error(firstError || data?.message || "Gagal memperbarui review.");
        if (response.status === 403) {
          handleCancelEdit();
        }
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error updating review:", error);
        toast.error("Terjadi kesalahan saat memperbarui review.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus review ini?")) {
      setIsDeleting(reviewId);
      try {
        const response = await authFetch(`/api/user/reviews/${reviewId}`, {
          method: "DELETE",
        });
        if (!response) {
          setIsDeleting(null);
          return;
        }
        if (response.ok || response.status === 204) {
          toast.success("Review berhasil dihapus.");
          fetchReviews(paginationMeta?.current_page || 1);
          checkEligibility();
        } else {
          const data = await response.json().catch(() => ({}));
          if (response.status !== 401 && response.status !== 403) {
            toast.error(data?.message || "Gagal menghapus review.");
          }
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error deleting review:", error);
          toast.error("Terjadi kesalahan saat menghapus review.");
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const renderStars = (
    currentRating,
    setRatingFunc,
    hoverState,
    setHoverFunc,
    disabled = false
  ) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={disabled}
        onClick={() => setRatingFunc(star)}
        onMouseEnter={() => !disabled && setHoverFunc(star)}
        onMouseLeave={() => !disabled && setHoverFunc(0)}
        className={`text-2xl md:text-3xl transition-colors disabled:opacity-50 ${
          (hoverState || currentRating) >= star
            ? "text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        } ${
          !disabled
            ? "hover:text-yellow-300 cursor-pointer"
            : "cursor-not-allowed"
        }`}
        aria-label={`Beri rating ${star} bintang`}
      >
        <Star fill="currentColor" strokeWidth={0} />
      </button>
    ));
  };

  const renderEligibilityMessage = () => {
    if (eligibilityLoading || !token) return null;
    if (hasReviewed) {
      return (
        <p className="text-sm text-center italic text-gray-500 dark:text-gray-400 my-4">
          Anda sudah memberikan ulasan untuk produk ini.
        </p>
      );
    }
    if (!canReview) {
      if (eligibilityReason === "not_delivered") {
        return (
          <p className="text-sm text-center italic text-gray-500 dark:text-gray-400 my-4">
            Anda bisa memberi ulasan setelah pesanan produk ini diterima.
          </p>
        );
      } else if (eligibilityReason === "not_purchased") {
        return (
          <p className="text-sm text-center italic text-gray-500 dark:text-gray-400 my-4">
            Anda harus membeli produk ini untuk memberi ulasan.
          </p>
        );
      }
    }
    return null;
  };

  return (
    <div className="rounded-lg p-1">
      <Title text1={"Ulasan"} text2={"Produk"} />

      {token && !eligibilityLoading && canReview && !hasReviewed && (
        <motion.form
          onSubmit={handleSubmitReview}
          className="mb-6 mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Berikan Ulasan Anda
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {renderStars(
              rating,
              handleStarClick,
              hoverRating,
              handleStarHover,
              isSubmitting
            )}
          </div>
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg focus:ring-1 focus:ring-pink-500 dark:text-white text-sm disabled:opacity-50"
            placeholder="Ceritakan pengalaman Anda..."
            rows="3"
            value={reviewText}
            onChange={handleReviewTextChange}
            disabled={isSubmitting}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-5 py-2 rounded-full mt-3 hover:bg-pink-700 transition-all text-sm font-medium disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}{" "}
            {isSubmitting ? "Mengirim..." : "Kirim Review"}
          </button>
        </motion.form>
      )}

      {renderEligibilityMessage()}

      <div className="space-y-4">
        {reviewLoading ? (
          <div className="text-center py-6">
            <Loader2 className="w-6 h-6 animate-spin inline text-pink-600" />
          </div>
        ) : reviewError ? (
          <div className="text-center text-red-500 py-6">
            <Info size={18} className="inline mr-1" /> {reviewError}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {editingReviewId === review.id ? (
                <form onSubmit={handleUpdateReview} className="space-y-3">
                  <div className="flex items-center gap-1">
                    {renderStars(
                      editRating,
                      handleEditStarClick,
                      editHoverRating,
                      handleEditStarHover,
                      isUpdating
                    )}
                  </div>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 rounded-lg focus:ring-1 focus:ring-pink-500 dark:text-white text-sm disabled:opacity-50"
                    rows="3"
                    value={editText}
                    onChange={handleEditTextChange}
                    disabled={isUpdating}
                    maxLength={1000}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isUpdating || editRating === 0}
                      className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-all text-xs font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      {" "}
                      {isUpdating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}{" "}
                      Simpan{" "}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-300 transition-all text-xs font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    >
                      {" "}
                      <X size={14} /> Batal{" "}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      {" "}
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          fill="currentColor"
                          strokeWidth={0}
                          className={`text-lg ${
                            review.rating >= star
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}{" "}
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 ml-2 font-medium">
                        {" "}
                        {review.user?.name ?? "Pengguna"}{" "}
                      </span>{" "}
                    </div>
                    {token &&
                      currentUser &&
                      currentUser.id === review.user?.id && (
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEditClick(review)}
                            disabled={isDeleting === review.id}
                            title="Edit Review"
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                          >
                            {" "}
                            <Edit size={14} />{" "}
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={isDeleting === review.id}
                            title="Hapus Review"
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          >
                            {" "}
                            {isDeleting === review.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}{" "}
                          </button>
                        </div>
                      )}
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap pt-1">
                    {review.review ?? ""}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
                    {" "}
                    {review.review_date
                      ? format(new Date(review.review_date), "dd MMM yy", {
                          locale: id,
                        })
                      : ""}{" "}
                  </p>
                </>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6 italic">
            Belum ada ulasan untuk produk ini.
          </p>
        )}

        {/* Tombol Pagination Sederhana (jika perlu) */}
        {paginationMeta && paginationMeta.last_page > 1 && (
          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => fetchReviews(paginationMeta.current_page - 1)}
              disabled={!paginationMeta.prev_page_url || reviewLoading}
              className="px-3 py-1 text-xs border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs">
              Page {paginationMeta.current_page} of {paginationMeta.last_page}
            </span>
            <button
              onClick={() => fetchReviews(paginationMeta.current_page + 1)}
              disabled={!paginationMeta.next_page_url || reviewLoading}
              className="px-3 py-1 text-xs border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ProductReview.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default ProductReview;
