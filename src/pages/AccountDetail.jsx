import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Loader2, Save } from "lucide-react";

const AccountDetails = () => {
  const { authFetch } = useContext(AppContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Yulita Cakes - Informasi Akun";
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setErrors({});
      try {
        const response = await authFetch("/api/user");
        if (!response) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (response.ok && data.data) {
          setUserData((prevState) => ({
            ...prevState,
            name: data.data.name || "",
            email: data.data.email || "",
          }));
        } else {
          throw new Error(data.message || "Gagal mengambil data pengguna.");
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error fetching user data:", error);
          toast.error(
            error.message || "Terjadi kesalahan saat mengambil data pengguna."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
    if (errors[name] || errors.global) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
        global: null,
      }));
    }
  };

  const validateFormData = (data) => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = ["Nama wajib diisi."];
    if (!data.email.trim()) newErrors.email = ["Email wajib diisi."];
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = ["Format email tidak valid."];

    if (data.password) {
      if (data.password.length < 8)
        newErrors.password = ["Password baru minimal 8 karakter."];
      if (!data.password_confirmation)
        newErrors.password_confirmation = [
          "Konfirmasi password baru wajib diisi.",
        ];
      else if (data.password !== data.password_confirmation)
        newErrors.password_confirmation = [
          "Konfirmasi password baru tidak cocok.",
        ];
    } else if (data.password_confirmation && !data.password) {
      newErrors.password = ["Password baru wajib diisi jika konfirmasi diisi."];
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(userData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const updateData = {
        name: userData.name,
        email: userData.email,
      };
      if (userData.password) {
        updateData.password = userData.password;
        updateData.password_confirmation = userData.password_confirmation;
      }

      const response = await authFetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response) {
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Profil berhasil diperbarui.");
        setUserData((prevState) => ({
          ...prevState,
          password: "",
          password_confirmation: "",
        }));
        setErrors({});
      } else if (response.status === 422) {
        setErrors(data.errors || {});
        toast.error("Periksa kembali data isian Anda.");
      } else {
        setErrors({ global: data.message || "Gagal memperbarui profil." });
        toast.error(data.message || "Gagal memperbarui profil.");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error updating user data:", error);
        setErrors({
          global: error.message || "Terjadi kesalahan saat memperbarui profil.",
        });
        toast.error(
          error.message || "Terjadi kesalahan saat memperbarui profil."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputField = (
    label,
    name,
    type = "text",
    required = false,
    placeholder = ""
  ) => (
    <div key={name} className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder || label}
        value={userData[name] || ""}
        onChange={handleChange}
        required={
          required && !["password", "password_confirmation"].includes(name)
        }
        className={`flex h-10 w-full rounded-md border bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          errors[name]
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
        disabled={isSubmitting || (name === "email" && false)}
        autoComplete={name.includes("password") ? "new-password" : "off"}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl dark:bg-gray-900 w-full lg:w-3/4 text-center">
        <p className="text-gray-500 dark:text-gray-400">Memuat data akun...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Informasi Akun
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6"
      >
        {/* Kolom Kiri */}
        <div>
          {renderInputField("Nama Lengkap", "name", "text", true)}
          {renderInputField("Email", "email", "email", true)}
        </div>
        {/* Kolom Kanan */}
        <div>
          {renderInputField(
            "Password Baru (kosongkan jika tidak ingin mengubah)",
            "password",
            "password",
            false
          )}
          {renderInputField(
            "Konfirmasi Password Baru",
            "password_confirmation",
            "password",
            false
          )}
        </div>

        {/* Tombol Simpan */}
        <div className="md:col-span-2 mt-4">
          {errors.global && (
            <p className="text-red-500 text-sm mb-3">{errors.global}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 shadow-sm disabled:bg-pink-400"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
