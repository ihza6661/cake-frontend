import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get("token");
  const email = query.get("email");

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Yulita Cakes - Reset Password";
    if (!token || !email) {
      toast.error("Link reset password tidak valid atau tidak lengkap.");
      navigate("/masuk");
    }
  }, [token, email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    if (errors.global) {
      setErrors((prevErrors) => ({ ...prevErrors, global: null }));
    }
  };

  const validateFormData = (data) => {
    const newErrors = {};
    if (!data.password) newErrors.password = ["Password baru wajib diisi."];
    else if (data.password.length < 8)
      newErrors.password = ["Password baru minimal 8 karakter."];
    if (!data.password_confirmation)
      newErrors.password_confirmation = ["Konfirmasi password wajib diisi."];
    else if (data.password !== data.password_confirmation)
      newErrors.password_confirmation = ["Konfirmasi password tidak cocok."];
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
        toast.success(data.message || "Password berhasil direset.");
        navigate("/masuk", { state: { resetSuccess: true } });
      } else if (response.status === 422) {
        setErrors(
          data.errors || {
            global: data.message || "Token tidak valid atau data tidak sesuai.",
          }
        );
        toast.error(data.message || "Periksa kembali isian atau link Anda.");
      } else {
        const errorMessage =
          data.message || "Terjadi kesalahan, silakan coba lagi.";
        setErrors({ global: errorMessage });
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      const networkErrorMessage =
        "Terjadi kesalahan jaringan, silakan coba lagi.";
      setErrors({ global: networkErrorMessage });
      toast.error(networkErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (field) => (
    <div key={field.name} className="grid w-full items-center gap-1.5">
      <label
        htmlFor={field.name}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {field.label}
      </label>
      <input
        type={field.type}
        id={field.name}
        name={field.name}
        placeholder={field.placeholder || field.label}
        value={formData[field.name]}
        onChange={handleChange}
        required
        className={`flex h-10 w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          errors[field.name] ||
          (errors.password_confirmation &&
            field.name === "password_confirmation")
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
        disabled={isLoading}
      />
      {errors[field.name] && (
        <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
      )}
      {field.name === "password_confirmation" &&
        errors.password_confirmation && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password_confirmation}
          </p>
        )}
    </div>
  );

  const formFields = [
    {
      label: "Password Baru",
      name: "password",
      type: "password",
      required: true,
    },
    {
      label: "Konfirmasi Password Baru",
      name: "password_confirmation",
      type: "password",
      required: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-pink-400">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 px-4">
            Masukkan password baru Anda.
          </p>
          {errors.global && (
            <div className="mt-4 text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-md border border-red-200 dark:border-red-800/50">
              <p>{errors.global}</p>
            </div>
          )}
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Email (read-only) */}
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
                value={email || ""}
                readOnly
                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
            {/* Password fields */}
            {formFields.map(renderFormField)}
            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 h-10 px-4 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Reset Password"}
            </button>
          </form>
        </div>
        <div className="p-6 pt-0 text-center border-t border-gray-200 dark:border-gray-700 mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ingat password Anda?{" "}
            <Link
              to="/masuk"
              className="text-pink-600 dark:text-pink-400 hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
