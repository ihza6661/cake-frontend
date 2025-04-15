import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Star, MessageSquareQuote, Info, Loader2 } from "lucide-react";

const RenderStars = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.max(
    0,
    Math.min(totalStars, Math.round(rating || 0))
  );
  return (
    <div className="flex items-center gap-0.5 justify-center md:justify-start">
      {" "}
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          size={18}
          fill={index < filledStars ? "currentColor" : "none"}
          className={`transition-colors ${
            index < filledStars
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};
RenderStars.propTypes = { rating: PropTypes.number };

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);
      setTestimonials([]);
      try {
        const response = await fetch(`/api/user/reviews/featured?limit=3`);
        if (!response.ok) {
          throw new Error(`Gagal memuat testimoni (${response.status})`);
        }
        const data = await response.json();
        setTestimonials(data?.data ?? []);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError(err.message || "Terjadi kesalahan saat memuat testimoni.");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-pink-600 uppercase bg-pink-100 dark:bg-pink-900 dark:text-pink-300 rounded-full">
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">
            Apa Kata Pelanggan Kami
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat
            testimoni...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-lg max-w-md mx-auto">
            <Info size={18} className="inline mr-1" /> {error}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-center">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col text-center md:text-left"
              >
                <div className="mb-3 text-pink-500 dark:text-pink-400 mx-auto md:mx-0">
                  <MessageSquareQuote size={32} strokeWidth={1.5} />
                </div>
                <RenderStars rating={testimonial.rating} />
                <blockquote className="text-gray-600 dark:text-gray-300 my-4 font-serif italic text-base flex-grow">
                  &quot;
                  {testimonial.review ?? "Pelanggan tidak memberikan komentar."}
                  &quot;
                </blockquote>
                <div className="flex items-center justify-center md:justify-start mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {testimonial.user?.name ?? "Pelanggan"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            Belum ada testimoni untuk ditampilkan.
          </p>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
