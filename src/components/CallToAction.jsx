import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Phone, Instagram } from "lucide-react";


const CallToAction = () => {
  return (
    <>
      <section className="section-padding bg-white dark:bg-pink-950">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-6">
              Siap Pesan Kue Impian Anda?
            </h2>
            <p className="text-lg text-gray-600 dark:text-pink-100 max-w-2xl mx-auto mb-8">
              Cari koleksi kue buatan tangan kami atau pesan desain kustom untuk
              acara spesial Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kue">
                <Button size="lg">
                  Belanja Sekarang
                </Button>
              </Link>
              <Link to="https://wa.me/6289603324917" target="_blank">
                <Button size="lg" variant="secondary">
                <Phone size={22} className="text-black" />
                  Kontak Kami
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CallToAction;
