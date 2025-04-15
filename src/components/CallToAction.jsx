import { motion } from "framer-motion";
import { Button } from "./ui/button";

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
              <Button href="/collection" size="lg">
                Belanja Sekarang
              </Button>

              <Button href="/contact" size="lg" variant="secondary">
                Kontak Kami
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CallToAction;
