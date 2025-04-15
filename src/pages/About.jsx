import { motion } from "framer-motion";
import { useEffect } from "react";
import Title from "../components/Title";

const About = () => {
  useEffect(() => {
    document.title = "Yulita Cakes - Tentang Kami";
  }, []);

  return (
    <div className="section-padding min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="prose prose-pink dark:prose-invert lg:prose-lg max-w-none pt-10">
          <Title text1="Yulita" text2="Cakes" />
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            Telah membuat kue dan Roti sejak 2010. Apa yang awalnya dimulai
            sebagai hobi keluarga kecil kini telah berkembang menjadi toko roti
            yang dicintai, dikenal karena kualitas, kreativitas, dan rasa yang
            lezat.
          </p>
          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-pink-50 dark:bg-pink-900/20 p-8 rounded-lg">
              <h2 className="text-2xl font-serif text-pink-600 dark:text-pink-400 mb-4">
                Misi Kami
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Kami percaya bahwa setiap Acara dan Perayaan layak mendapatkan
                sesuatu yang manis dan istimewa. Misi kami adalah menciptakan
                hidangan penutup yang berkesan dengan menggunakan hanya
                bahan-bahan terbaik, dibuat dengan penuh perhatian dan
                ketelitian.
              </p>
            </div>

            <div className="bg-pink-50 dark:bg-pink-900/20 p-8 rounded-lg">
              <h2 className="text-2xl font-serif text-pink-600 dark:text-pink-400 mb-4">
                Visi Kami
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Menjadi destinasi utama untuk kue dan makanan penutup kustom,
                membawa kebahagiaan dan manisnya dalam setiap momen spesial
                kehidupan, sambil tetap berkomitmen pada kualitas dan inovasi.
              </p>
            </div>
          </div>
          <h2 className="text-3xl font-serif text-pink-600 dark:text-pink-400 mt-8 mb-6">
            Kisah Kami
          </h2>
          <p className="mb-4">
            Yulita Cakes bermula dari dapur pendirinya, Yulita. Apa yang awalnya
            hanya berupa kegiatan memanggang untuk teman dan keluarga segera
            berkembang ketika kabar tentang kelezatan kuenya menyebar. Dalam
            waktu satu tahun, Yulita membuka toko roti kecil pertama kami.
          </p>
          <p className="mb-4">
            Selama bertahun-tahun, kami telah memperluas tim kami dengan para
            pastry chef dan dekorator kue berbakat yang memiliki semangat yang
            sama dalam menciptakan hidangan penutup yang indah dan lezat. Saat
            ini, kami melayani pelanggan baik secara lokal maupun nasional
            melalui layanan pemesanan dan pengiriman online kami.
          </p>
          <p className="mb-8">
            Meskipun kami telah berkembang, komitmen kami terhadap kualitas
            tetap tidak berubah. Kami masih menggunakan resep asli Yulita,
            bahan-bahan lokal saat memungkinkan, dan memastikan setiap kue
            dibuat dengan penuh perhatian dan ketelitian.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
