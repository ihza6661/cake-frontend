import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const Addresses = () => {
  const { authFetch } = useContext(AppContext);

  // Initial form data structure
  const getInitialFormData = () => ({
    recipient_name: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    province: "",
    city: "",
    postal_code: "",
    is_default: false,
  });

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    document.title = "Yulita Cakes - Alamat";
  }, []);

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Fetch addresses function with useCallback
  const fetchAddresses = useCallback(async () => {
    try {
      const response = await authFetch("/api/user/addresses");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mengambil data alamat.");
      }
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error(
        error.message || "Terjadi kesalahan saat mengambil data alamat.",
        { className: "toast-custom" }
      );
    }
  }, [authFetch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const url = editingAddressId
        ? `/api/user/addresses/${editingAddressId}`
        : "/api/user/addresses";
      const method = editingAddressId ? "PUT" : "POST";

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Alamat berhasil disimpan."),
          { className: "toast-custom" };
        // Refresh addresses to update default flags and new entries
        await fetchAddresses();
        resetForm();
      } else if (response.status === 422) {
        setErrors(data.errors || {});
      } else {
        throw new Error(data.message || "Gagal menyimpan alamat.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan alamat."),
        { className: "toast-custom" };
    }
  };

  // Handle address deletion
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      try {
        const response = await authFetch(`/api/user/addresses/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "Alamat berhasil dihapus."),
            { className: "toast-custom" };
          // Refresh addresses after deletion
          await fetchAddresses();
        } else {
          throw new Error(data.message || "Gagal menghapus alamat.");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error(
          error.message || "Terjadi kesalahan saat menghapus alamat.",
          { className: "toast-custom" }
        );
      }
    }
  };

  // Handle editing an address
  const handleEdit = (address) => {
    setFormData({
      recipient_name: address.recipient_name,
      phone_number: address.phone_number,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      province: address.province,
      city: address.city,
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setEditingAddressId(address.id);
    setShowForm(true);
  };

  // Reset the form to initial state
  const resetForm = () => {
    setFormData(getInitialFormData());
    setEditingAddressId(null);
    setShowForm(false);
    setErrors({});
  };

  // Client-side form validation function
  const validateFormData = (data) => {
    const errors = {};
    if (!data.recipient_name)
      errors.recipient_name = ["Nama penerima wajib diisi."];
    if (!data.phone_number)
      errors.phone_number = ["Nomor telepon wajib diisi."];
    if (!data.address_line1)
      errors.address_line1 = ["Alamat baris 1 wajib diisi."];
    if (!data.province) errors.province = ["Provinsi wajib diisi."];
    if (!data.city) errors.city = ["Kota wajib diisi."];
    if (!data.postal_code) errors.postal_code = ["Kode pos wajib diisi."];
    return errors;
  };

  return (
    <div className="p-6 rounded-xl accent dark:bg-gray-900 mx-auto w-full lg:w-3/4">
      <h3 className="text-2xl font-semibold mb-6">Alamat Pengiriman</h3>

      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="mb-4 font-medium px-6 py-3 rounded-lg flex shadow-md transition duration-300"
        >
          Tambah Alamat Baru
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 bg-pink-100 dark:bg-gray-800 p-6 rounded-lg"
        >
          {[
            { label: "Nama Penerima", name: "recipient_name" },
            { label: "Nomor Telepon", name: "phone_number" },
            { label: "Alamat Baris 1", name: "address_line1" },
            { label: "Alamat Baris 2 (Opsional)", name: "address_line2" },
            { label: "Provinsi", name: "province" },
            { label: "Kota", name: "city" },
            { label: "Kode Pos", name: "postal_code" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block p-2 font-medium">{label}</label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition"
              />
              {errors[name] && (
                <p className="text-red-500 text-sm">{errors[name][0]}</p>
              )}
            </div>
          ))}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-pink-700 dark:text-pink-300 font-medium">
              Jadikan alamat utama
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="font-medium px-6 py-3 rounded-lg shadow-md transition duration-300"
            >
              {editingAddressId ? "Perbarui Alamat" : "Simpan Alamat"}
            </Button>
            {editingAddressId && (
              <Button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 font-medium rounded-lg shadow-md transition duration-300"
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Anda belum menambahkan alamat.
        </p>
      ) : (
        <div className="grid gap-4 mt-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl leading-relaxed"
            >
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <p className="border-b border-gray-200 dark:border-gray-700 pb-1 font-semibold text-pink-700 dark:text-pink-300">
                  <span className="text-gray-800 dark:text-white font-medium">
                    Nama:
                  </span>{" "}
                  {address.recipient_name}
                </p>

                <p className="border-b border-gray-200 dark:border-gray-700 pb-1 text-gray-700 dark:text-gray-300">
                  <span className="text-gray-800 dark:text-white font-medium">
                    No. Telepon:
                  </span>{" "}
                  {address.phone_number}
                </p>

                <p className="border-b border-gray-200 dark:border-gray-700 pb-1 text-gray-700 dark:text-gray-300">
                  <span className="text-gray-800 dark:text-white font-medium">
                    Alamat:
                  </span>{" "}
                  {address.address_line1}
                </p>

                {address.address_line2 && (
                  <p className="border-b border-gray-200 dark:border-gray-700 pb-1 text-gray-700 dark:text-gray-300">
                    {address.address_line2}
                  </p>
                )}

                <p className="border-b border-gray-200 dark:border-gray-700 pb-1 text-gray-700 dark:text-gray-300">
                  <span className="text-gray-800 dark:text-white font-medium">
                    Kota:
                  </span>{" "}
                  {address.city}, {address.province}, {address.postal_code}
                </p>
              </div>

              {address.is_default && (
                <span className="text-red-500 font-semibold">[Utama]</span>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={() => handleEdit(address)}
                  className=""
                  size="sm"
                  variant="secondary"
                >
                  Ubah
                </Button>
                <Button
                  onClick={() => handleDelete(address.id)}
                  className="bg-red-400 hover:bg-red-500 dark:bg-red-900 dark:hover:bg-red-800"
                  size="sm"
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
