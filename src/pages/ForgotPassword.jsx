import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  useEffect(() => {
    document.title = "Yulita Cakes - Lupa Password";
  }, []);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email || errors.global) {
      setErrors({});
    }
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    if (!email.trim()) {
      setErrors({ email: ["Email wajib diisi."] });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: ["Format email tidak valid."] });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/password/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Link reset password telah dikirim.");
        setMessage(
          data.message ||
            "Link reset password telah dikirim, silakan cek email Anda."
        );
        setEmail("");
      } else {
        const errorMessage =
          data.message || "Terjadi kesalahan, silakan coba lagi.";
        setErrors({ global: errorMessage });
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      const networkErrorMessage =
        "Terjadi kesalahan jaringan, silakan coba lagi.";
      setErrors({ global: networkErrorMessage });
      toast.error(networkErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-pink-400">
            Lupa Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 px-4">
            Masukkan email Anda yang terdaftar untuk menerima link reset
            password.
          </p>
          {errors.global && (
            <div className="mt-4 text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-md border border-red-200 dark:border-red-800/50">
              <p>{errors.global}</p>
            </div>
          )}
          {message && !errors.global && (
            <div className="mt-4 text-green-700 dark:text-green-300 text-sm bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-md border border-green-200 dark:border-green-800/50">
              <p>{message}</p>
            </div>
          )}
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid w-full items-center gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email terdaftar Anda"
                value={email}
                onChange={handleChange}
                required
                className={`flex h-10 w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 h-10 px-4 py-2"
              disabled={isLoading || !!message}
            >
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
        </div>
        <div className="p-6 pt-0 text-center border-t border-gray-200 dark:border-gray-700 mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kembali ke{" "}
            <Link
              to="/masuk"
              className="text-pink-600 dark:text-pink-400 hover:underline font-semibold"
            >
              Halaman Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
