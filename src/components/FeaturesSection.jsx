// import React from "react";
import { Cake, Gift, Clock } from "lucide-react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Cake className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
      title: "Buatan tangan",
      description: "Setiap kue dibuat dengan memperhatikan setiap detail.",
    },
    {
      icon: <Gift className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
      title: "Pesanan Kustom",
      description:
        "Buat kue yang dipersonalisasi untuk acara apa pun, sesuai keinginan Anda.",
    },
    {
      icon: <Clock className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
      title: "Segar Setiap Hari",
      description:
        "Kami memanggang kue segar setiap hari, menggunakan bahan dan alat berkualitas tinggi.",
    },
  ];
  return (
    <div>
      {/* Features Section */}
      <section className="section-padding bg-pink-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-pink-600 uppercase bg-pink-100 dark:bg-pink-900 dark:text-pink-300 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">
              Our Sweet Promises
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kami bangga membuat kue-kue lezat dan indah untuk momen-momen
              spesial Anda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;
