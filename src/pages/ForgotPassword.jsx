import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  useEffect(() => {
    document.title = "Yulita Cakes - Lupa Password";
  }, []);

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email wajib diisi.");
      return;
    }

    try {
      const response = await fetch("/api/password/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Link reset password telah dikirim."), { className: "toast-custom" };
        setMessage(data.message);
      } else {
        setError(data.message || "Terjadi kesalahan, silakan coba lagi.");
        toast.error(data.message || "Terjadi kesalahan, silakan coba lagi."), { className: "toast-custom" };
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan, silakan coba lagi.", err);
      toast.error("Terjadi kesalahan jaringan, silakan coba lagi."), { className: "toast-custom" };
    }
  };

  return (
    <div className="py-24">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4"
      >
        <h2 className="text-3xl font-bold">Lupa Password</h2>
        <p className="text-center text-gray-800">
          Masukkan email anda yang terdaftar untuk menerima link reset password.
        </p>

        <div className="w-full">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
        </div>

        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-8 py-2 mt-4 rounded-lg transition duration-300"
        >
          Kirim Link Reset
        </button>

        <p className="mt-4 text-sm text-pink-600">
          Kembali ke{" "}
          <Link
            to="/login"
            className="hover:underline font-semibold text-gray-800"
          >
            Halaman Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
