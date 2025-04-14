import { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  // Initial form data structure
  const getInitialFormData = () => ({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // State Management
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let judul = isLogin ? "Masuk" : "Register";
    document.title = `Yulita Cakes - ${judul}`;
  }, [isLogin]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
      global: null,
    }));
  };

  // Client-side form validation function
  const validateFormData = (data) => {
    const errors = {};

    if (!data.email) errors.email = ["Email wajib diisi."];
    if (!data.password) errors.password = ["Password wajib diisi."];

    if (!isLogin) {
      if (!data.name) errors.name = ["Nama wajib diisi."];
      if (!data.password_confirmation)
        errors.password_confirmation = ["Konfirmasi password wajib diisi."];
      if (data.password !== data.password_confirmation)
        errors.password_confirmation = ["Konfirmasi password tidak cocok."];
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const endpoint = isLogin ? "/api/user/login" : "/api/user/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      } else {
        throw new Error(
          data.message || "Terjadi kesalahan, silakan coba lagi."
        );
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error(
        error.message || "Terjadi kesalahan jaringan, silakan coba lagi."
      );
    }
  };

  // Reset the form to initial state
  const resetForm = () => {
    setFormData(getInitialFormData());
    setErrors({});
  };

  // Toggle between login and register forms
  const toggleForm = () => {
    resetForm();
    setIsLogin(!isLogin);
  };

  return (
    <div className="container mx-auto px-4 py-32 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md dark:bg-gray-900">
        <CardHeader className="space-y-1 text-center">
          {/* Title Section */}
          <CardTitle className="text-2xl font-serif">
            <h1 className="dark:text-pink-500 text-4xl">
              {isLogin ? "Masuk" : "Daftar"}
            </h1>
          </CardTitle>
          <CardDescription>
            Masukkan Email dan Password Anda untuk masuk.
            {/* Error Message */}
            {errors.global && (
              <div className="text-red-500 text-sm bg-red-100 px-4 py-2 rounded-md">
                <p>{errors.global}</p>
              </div>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="accent flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-5 text-gray-700 bg-white p-8 rounded-3xl shadow-lg"
          >
            {/* Form Fields */}
            {renderFormFields()}

            {/* Submit Button */}
            <Button className="font-medium px-8 py-3 mt-4 rounded-full transition duration-300 shadow-md dark:bg-pink-600">
              {isLogin ? "Masuk" : "Daftar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {/* Switch Form Type */}
          <p className="mt-4 text-sm">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <span
              className="text-pink-500 cursor-pointer font-semibold"
              onClick={toggleForm}
            >
              {isLogin ? "Daftar" : "Masuk"}
            </span>
          </p>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            Dengan masuk, Anda menyetujui{" "}
            <Link to="/terms" className="underline">
              Syarat Layanan
            </Link>{" "}
            dan{" "}
            <Link to="/privacy" className="underline">
              Kebijakan Privasi
            </Link>{" "}
            Kami
          </div>

          {/* Forgot Password */}
          {isLogin && (
            <p className="mt-2 text-sm">
              <Link to="/forgot-password" className="text-pink-500 font-medium">
                Lupa Password?
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );

  // Render form fields with validation
  function renderFormFields() {
    const fields = [];

    if (!isLogin) {
      fields.push({
        label: "Nama Lengkap",
        name: "name",
        type: "text",
        required: true,
      });
    }

    fields.push(
      { label: "Email", name: "email", type: "email", required: true },
      { label: "Password", name: "password", type: "password", required: true }
    );

    if (!isLogin) {
      fields.push({
        label: "Konfirmasi Password",
        name: "password_confirmation",
        type: "password",
        required: true,
      });
    }

    return (
      <>
        {fields.map((field) => (
          <div key={field.name} className="w-full">
            <input
              name={field.name}
              onChange={handleChange}
              value={formData[field.name]}
              type={field.type}
              className="w-full px-3 py-2 bg-white dark:bg-pink-50 text-gray-800 border border-pink-500 rounded-lg 
                     placeholder-gray-400 dark:placeholder-gray-600"
              placeholder={field.label}
              required={field.required}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name][0]}</p>
            )}
          </div>
        ))}
      </>
    );
  }
};

export default AuthForm;
