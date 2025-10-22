import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "@/context/AppContextObject";
import { toast } from "react-toastify";
import { Plus, Edit3, Trash2, CheckCircle, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Addresses = () => {
  const { authFetch } = useContext(AppContext);

  const getInitialFormData = useCallback(
    () => ({
      recipient_name: "",
      phone_number: "",
      address_line1: "",
      address_line2: "",
      province: "",
      city: "",
      postal_code: "",
      is_default: false,
    }),
    []
  );

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Brownies Squishy - Alamat Saya";
  }, []);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authFetch("/user/addresses");
      if (!response) {
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setAddresses(data.data || []);
      } else {
        throw new Error(data.message || "Gagal mengambil data alamat.");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error fetching addresses:", error);
        setError("Gagal memuat alamat. Coba refresh halaman.");
        toast.error(
          error.message || "Terjadi kesalahan saat mengambil data alamat."
        );
      }
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    if (errors.global) {
      setErrors((prevErrors) => ({ ...prevErrors, global: null }));
    }
  };

  const validateFormData = (data) => {
    const newErrors = {};
    if (!data.recipient_name.trim())
      newErrors.recipient_name = ["Nama penerima wajib diisi."];
    if (!data.phone_number.trim())
      newErrors.phone_number = ["Nomor telepon wajib diisi."];
    else if (!/^(08|\+628)[0-9]{8,12}$/.test(data.phone_number))
      newErrors.phone_number = ["Format nomor telepon tidak valid."];
    if (!data.address_line1.trim())
      newErrors.address_line1 = ["Alamat baris 1 wajib diisi."];
    if (!data.province.trim()) newErrors.province = ["Provinsi wajib diisi."];
    if (!data.city.trim()) newErrors.city = ["Kota wajib diisi."];
    if (!data.postal_code.trim())
      newErrors.postal_code = ["Kode pos wajib diisi."];
    else if (!/^[0-9]{5}$/.test(data.postal_code))
      newErrors.postal_code = ["Kode pos harus 5 digit angka."];
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setErrors({});

    try {
      const url = editingAddressId
        ? `/api/user/addresses/${editingAddressId}`
        : "/api/user/addresses";
      const method = editingAddressId ? "PUT" : "POST";
      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response) {
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      if (response.ok || response.status === 201) {
        toast.success(data.message || "Alamat berhasil disimpan.");
        await fetchAddresses();
        resetForm();
      } else if (response.status === 422) {
        setErrors(
          data.errors || { global: data.message || "Periksa input Anda." }
        );
        toast.error("Periksa kembali data isian Anda.");
      } else {
        setErrors({ global: data.message || "Gagal menyimpan alamat." });
        throw new Error(data.message || "Gagal menyimpan alamat.");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error saving address:", error);
        if (Object.keys(errors).length === 0) {
          setErrors({
            global: error.message || "Terjadi kesalahan saat menyimpan alamat.",
          });
        }
        toast.error(
          error.message || "Terjadi kesalahan saat menyimpan alamat."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      setIsSubmitting(true);
      try {
        const response = await authFetch(`/api/user/addresses/${id}`, {
          method: "DELETE",
        });
        if (!response) {
          setIsSubmitting(false);
          return;
        }

        if (response.ok || response.status === 204) {
          toast.success("Alamat berhasil dihapus.");
          await fetchAddresses();
        } else {
          let data = {};
          try {
            data = await response.json();
          } catch {
            /* abaikan */
          }
          throw new Error(data.message || "Gagal menghapus alamat.");
        }
      } catch (error) {
        if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
          console.error("Error deleting address:", error);
          toast.error(
            error.message || "Terjadi kesalahan saat menghapus alamat."
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSetDefault = async (id) => {
    setIsSubmitting(true);
    try {
      const response = await authFetch(
        `/api/user/addresses/${id}/set-default`,
        { method: "PATCH", headers: { Accept: "application/json" } }
      );
      if (!response) {
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Alamat default berhasil diperbarui.");
        await fetchAddresses();
      } else {
        throw new Error(data.message || "Gagal menjadikan alamat default.");
      }
    } catch (error) {
      if (error.message !== "Unauthorized" && error.message !== "Forbidden") {
        console.error("Error setting default address:", error);
        toast.error(
          error.message || "Terjadi kesalahan saat menjadikan alamat default."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      recipient_name: address.recipient_name || "",
      phone_number: address.phone_number || "",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      province: address.province || "",
      city: address.city || "",
      postal_code: address.postal_code || "",
      is_default: address.is_default || false,
    });
    setEditingAddressId(address.id);
    setShowForm(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setEditingAddressId(null);
    setShowForm(false);
    setErrors({});
  };

  const renderInputField = (label, name, type = "text", required = false) => (
    <div key={name} className="mb-3">
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
        value={formData[name] || ""}
        onChange={handleChange}
        required={required}
        className={`flex h-10 w-full rounded-md border bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:focus-visible:ring-pink-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
          errors[name]
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
        disabled={isSubmitting}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm min-h-[300px]">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Alamat Pengiriman Saya
      </h3>

      {!showForm && (
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setEditingAddressId(null);
            setFormData(getInitialFormData());
            setErrors({});
          }}
          className="mb-6 inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 shadow-md"
        >
          <Plus className="w-4 h-4" /> Tambah Alamat Baru
        </button>
      )}

      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mb-8 bg-pink-50 dark:bg-gray-800 p-6 rounded-lg border border-pink-200 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="md:col-span-2 text-lg font-medium mb-3 text-gray-800 dark:text-white">
            {editingAddressId ? "Edit Alamat" : "Tambah Alamat Baru"}
          </div>
          {renderInputField("Nama Penerima", "recipient_name", "text", true)}
          {renderInputField("Nomor Telepon", "phone_number", "tel", true)}
          {renderInputField("Alamat Baris 1", "address_line1", "text", true)}
          {renderInputField("Alamat Baris 2 (Opsional)", "address_line2")}
          {renderInputField("Provinsi", "province", "text", true)}
          {renderInputField("Kota/Kabupaten", "city", "text", true)}
          {renderInputField("Kode Pos", "postal_code", "text", true)}

          <div className="md:col-span-2 flex items-center mt-2 mb-4">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2 cursor-pointer"
              disabled={isSubmitting}
            />
            <label
              htmlFor="is_default"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Jadikan alamat utama (default)
            </label>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {editingAddressId ? "Perbarui Alamat" : "Simpan Alamat"}
            </button>
            {editingAddressId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 shadow-sm"
              >
                Batal
              </button>
            )}
          </div>
          {errors.global && (
            <p className="md:col-span-2 text-red-500 text-sm mt-2">
              {errors.global}
            </p>
          )}
        </motion.form>
      )}

      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Memuat alamat...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 py-10">{error}</p>
      ) : addresses.length === 0 && !showForm ? (
        <p className="text-gray-600 dark:text-gray-300 text-center py-10">
          Anda belum menambahkan alamat pengiriman.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
                address.is_default
                  ? "border-pink-400 dark:border-pink-500 ring-1 ring-pink-400 dark:ring-pink-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300 mb-3">
                <p className="font-semibold text-base text-gray-800 dark:text-white flex items-center">
                  {address.recipient_name}
                  {address.is_default && (
                    <span className="ml-2 text-xs font-bold text-white bg-pink-500 px-2 py-0.5 rounded-full align-middle">
                      Utama
                    </span>
                  )}
                </p>
                <p>{address.phone_number}</p>
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>
                  {address.city}, {address.province}, {address.postal_code}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                <button
                  type="button"
                  onClick={() => handleEdit(address)}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 disabled:opacity-50"
                >
                  <Edit3 className="w-3 h-3" /> Ubah
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  disabled={
                    isSubmitting ||
                    (address.is_default && addresses.length <= 1)
                  }
                  className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    address.is_default && addresses.length <= 1
                      ? "Tidak bisa hapus alamat default jika hanya satu"
                      : "Hapus Alamat"
                  }
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
                {!address.is_default && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900 disabled:opacity-50"
                  >
                    <Star className="w-3 h-3" /> Jadikan Utama
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
