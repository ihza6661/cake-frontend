import Title from "../components/Title";
import { Phone, Mail, Instagram } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
const locations = [
  {
    city: "Kubu Raya",
    // location: "Kubu Raya ",
    // direction: "12 km"
  },
];

const Contact = () => {
  useEffect(() => {
    document.title = "Yulita Cakes - Kontak";
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title Section */}
        <div className="text-center md:text-start text-2xl border-t border-pink-200 pt-24 sm:pt-28 lg:pt-36">
          <Title text1="Kontak" text2="Yulita Cakes" />
          <p className="text-sm sm:text-base max-w-xl mx-auto md:mx-0">
            Ada pertanyaan atau permintaan khusus? Jangan ragu untuk menghubungi
            kami langsung!
          </p>
        </div>

        {/* Content Section */}
        <div className="my-12 lg:my-16 flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="w-full sm:w-3/4 md:w-1/2 lg:max-w-[480px] mx-auto">
            <img
              className="w-full rounded-2xl shadow-md object-cover"
              src="https://images.unsplash.com/photo-1487611459768-bd414656ea10?q=80&w=2880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Cake Shop"
            />
          </div>

          {/* Contact Info Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md w-full gap-6">
            <h3 className="font-semibold text-2xl sm:text-3xl text-pink-900 dark:text-pink-500 tracking-wide">
              Kontak
            </h3>
            <div className="space-y-4">
              <a
                href="https://wa.me/6289603324917"
                className="flex items-center gap-2 hover:text-pink-800 transition"
              >
                <Phone size={22} className="text-pink-500" /> +62 896 0332 4917
              </a>
              <a
                href="https://www.instagram.com/cakesyulita"
                className="flex items-center gap-2 hover:text-pink-800 transition"
              >
                <Instagram size={22} className="text-pink-500" /> @cakesyulita
              </a>
              <a
                href="mailto:cakesyulita57@gmail.com"
                className="flex items-center gap-2 hover:text-pink-800 transition"
              >
                <Mail size={22} className="text-pink-500" />{" "}
                cakesyulita57@gmail.com
              </a>
            </div>
            <h3 className="font-semibold text-2xl sm:text-3xl text-pink-900 dark:text-pink-500 tracking-wide">
              Pesanan & Custom Cake
            </h3>
            <p className="leading-relaxed text-base sm:text-lg font-light">
              Dapatkan kue spesial untuk acara Anda
            </p>
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/6289603324917"
              className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300"
            >
              Pesan via WhatsApp
            </a>
          </div>
        </div>
      </motion.div>

      {/* Store Location Section */}
      <div className="text-center text-xl py-6 text-pink-800">
        <Title text1="Kunjungi Toko" text2="Kami" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Google Maps */}
        <div className="bg-white dark:bg-gray-300 p-4 rounded-xl shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.815387737623!2d109.38512177507026!3d-0.06946849992984418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d5752ef0719af%3A0xc40b57fad7df9bd7!2sJl.%20Prona%20Desa%20Kapur%2C%20Kapur%2C%20Kec.%20Sungai%20Raya%2C%20Kabupaten%20Kubu%20Raya%2C%20Kalimantan%20Barat%2078235!5e0!3m2!1sid!2sid!4v1742050633918!5m2!1sid!2sid"
            width="100%"
            height="350"
            className="rounded-lg"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Store Info */}
        <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
          {locations.map(({ city }, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-lg p-6 bg-pink-50 dark:bg-gray-900"
            >
              <Title text1="Kabupaten" text2={city} />
              <p className="text-gray-800 text-base">
                Jl. Raya Desa Kapur. Gg. Prona No. 07, Kalimantan Barat
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>

    // </div>
    // </div>
  );
};

export default Contact;
