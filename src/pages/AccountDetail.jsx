import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";

const AccountDetails = () => {
  const { authFetch } = useContext(AppContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Yulita Cakes - Informasi Akun";
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authFetch("/api/user/get_user");
        const data = await response.json();

        if (response.ok) {
          setUserData((prevState) => ({
            ...prevState,
            name: data.name,
            email: data.email,
          }));
        } else {
          toast.error(data.message || "Gagal mengambil data pengguna."),
            { className: "toast-custom" };
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Terjadi kesalahan saat mengambil data pengguna."),
          { className: "toast-custom" };
      }
    };

    fetchUserData();
  }, [authFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Profil berhasil diperbarui."),
          { className: "toast-custom" };
        setUserData((prevState) => ({
          ...prevState,
          password: "",
          password_confirmation: "",
        }));
        setErrors({});
      } else if (response.status === 422) {
        setErrors(data.errors || {});
      } else {
        toast.error(data.message || "Gagal memperbarui profil."),
          { className: "toast-custom" };
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Terjadi kesalahan saat memperbarui profil."),
        { className: "toast-custom" };
    }
  };

  return (
    <div className="rounded-xl dark:bg-gray-900 w-full lg:w-3/4 p-6">
      <h3 className="text-2xl font-semibold mb-6">Informasi Akun</h3>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 bg-pink-100 dark:bg-gray-800 p-6 rounded-lg"
      >
        {[
          { label: "Nama Lengkap", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password Baru", name: "password", type: "password" },
          {
            label: "Konfirmasi Password Baru",
            name: "password_confirmation",
            type: "password",
          },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-medium mb-2">{label}</label>
            <input
              type={type}
              name={name}
              value={userData[name]}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-900 p-3 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-white outline-none transition"
            />

            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name][0]}</p>
            )}
          </div>
        ))}

        <Button
          type="submit"
          className="w-full font-medium py-6 rounded-lg shadow-md transition duration-300"
        >
          Simpan Perubahan
        </Button>
      </form>
    </div>
  );
};

export default AccountDetails;
