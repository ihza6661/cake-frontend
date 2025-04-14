import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get("token");
  const email = query.get("email");

  useEffect(() => {
    document.title = "Yulita Cakes - Reset Password";
    // Jika token atau email tidak ada, redirect ke halaman login
    if (!token || !email) {
      toast.error("Link reset password tidak valid."), { className: "toast-custom" };
      navigate("/login");
    }
  }, [token, email, navigate]);

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null, global: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana: pastikan password dan konfirmasi cocok
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: "Konfirmasi password tidak cocok." });
      return;
    }

    try {
      const response = await fetch("/api/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Password berhasil direset."), { className: "toast-custom" };
        navigate("/login");
      } else if (response.status === 422) {
        setErrors(data.errors || {});
      } else {
        toast.error(data.message || "Terjadi kesalahan, silakan coba lagi."), { className: "toast-custom" };
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan, silakan coba lagi."), { className: "toast-custom" };
    }
  };

  return (
    <div className="pt-24">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <h2 className="text-3xl font-bold">Reset Password</h2>

        <div className="w-full">
          <input
            type="password"
            name="password"
            placeholder="Password Baru"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="w-full">
          <input
            type="password"
            name="password_confirmation"
            placeholder="Konfirmasi Password Baru"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-black text-white font-light px-8 py-2 mt-4"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
