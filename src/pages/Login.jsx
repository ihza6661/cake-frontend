import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AuthForm = () => {
  const { setToken, API_BASE_URL } = useContext(AppContext);
  const navigate = useNavigate();

  const getInitialFormData = () => ({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = `Yulita Cakes - ${isLogin ? "Masuk" : "Daftar"}`;
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    if (errors.global) {
      setErrors((prevErrors) => ({ ...prevErrors, global: null }));
    }
  };

  const validateFormData = (data) => {
    const newErrors = {};
    if (!isLogin && !data.name.trim()) newErrors.name = ["Nama wajib diisi."];
    if (!data.email.trim()) newErrors.email = ["Email wajib diisi."];
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = ["Format email tidak valid."];
    if (!data.password) newErrors.password = ["Password wajib diisi."];
    else if (!isLogin && data.password.length < 8)
      newErrors.password = ["Password minimal 8 karakter."];

    if (!isLogin) {
      if (!data.password_confirmation)
        newErrors.password_confirmation = ["Konfirmasi password wajib diisi."];
      else if (data.password !== data.password_confirmation)
        newErrors.password_confirmation = ["Konfirmasi password tidak cocok."];
    }
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

    const endpoint = isLogin
      ? `${API_BASE_URL}/user/login`
      : `${API_BASE_URL}/user/register`;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          setToken(data.token);
          toast.success("Login berhasil!");
          navigate("/");
        } else {
          toast.success("Registrasi berhasil! Silakan login.");
          resetForm();
          setIsLogin(true);
        }
      } else if (response.status === 422) {
        setErrors(data.errors || {});
        toast.error("Periksa kembali data isian Anda.");
      } else {
        setErrors({ global: data.message || "Terjadi kesalahan pada server." });
        toast.error(data.message || "Terjadi kesalahan, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setErrors({ global: "Tidak dapat terhubung ke server." });
      toast.error("Terjadi kesalahan jaringan, silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setErrors({});
    setIsLoading(false);
  };

  const toggleForm = () => {
    resetForm();
    setIsLogin(!isLogin);
  };

  const renderFormField = (field) => (
    <div key={field.name} className="grid w-full items-center gap-1.5">
      <label
        htmlFor={field.name}
        className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
        required={field.required}
        className={`flex h-10 w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          errors[field.name]
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
        disabled={isLoading}
      />
      {errors[field.name] && (
        <p className="text-red-500 text-sm mt-1">{errors[field.name][0]}</p>
      )}
    </div>
  );

  const formFields = [
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Password", name: "password", type: "password", required: true },
  ];

  if (!isLogin) {
    formFields.unshift({
      label: "Nama Lengkap",
      name: "name",
      type: "text",
      required: true,
    });
    formFields.push({
      label: "Konfirmasi Password",
      name: "password_confirmation",
      type: "password",
      required: true,
    });
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md dark:bg-gray-950 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold font-serif dark:text-pink-400">
            {isLogin ? "Masuk Akun" : "Daftar Akun Baru"}
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            {isLogin
              ? "Masukkan email dan password Anda."
              : "Isi data berikut untuk membuat akun."}
          </CardDescription>
          {errors.global && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-md border border-red-200 dark:border-red-800/50">
              <p>{errors.global}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {formFields.map(renderFormField)}
            <Button
              type="submit"
              className="w-full mt-4 dark:bg-pink-600 dark:hover:bg-pink-700"
              disabled={isLoading}
            >
              {isLoading
                ? isLogin
                  ? "Memproses..."
                  : "Mendaftar..."
                : isLogin
                ? "Masuk"
                : "Daftar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-3 pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <span
              className="text-pink-600 dark:text-pink-400 cursor-pointer font-semibold hover:underline"
              onClick={toggleForm}
            >
              {isLogin ? "Daftar di sini" : "Masuk di sini"}
            </span>
          </p>
          {isLogin && (
            <p className="text-sm">
              <Link
                to="/lupa-password"
                className="text-pink-600 dark:text-pink-400 hover:underline"
              >
                Lupa Password?
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
