import React from 'react'
import { motion } from 'framer-motion';


const Testimonials = () => {
    const testimonials = [
        {
          quote: "Kue ulang tahunnya benar-benar memukau dan rasanya bahkan lebih enak! Semua orang di acara terkesan.",
          author: "Ihza",
          role: "Pelanggan Bahagia"
        },
        {
          quote: "Kue pernikahan kami seperti mimpi yang jadi kenyataan. Desainnya persis seperti yang kami bayangkan, dan rasanya sempurna..",
          author: "Venia & Sarah",
          role: "Pengantin Baru"
        },
        {
          quote: "Saya telah memesan beberapa kue untuk acara spesial, dan hasilnya selalu memuaskan. Kualitas dan rasanya selalu luar biasa..",
          author: "Enricho",
          role: "Pelanggan Setia"
        }
      ];


  return (


    <>
    {/* Testimonials Section */}
    <section className="section-padding bg-white dark:bg-gray-950">
    <div className="container mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-pink-600 uppercase bg-pink-100 dark:bg-pink-900 dark:text-pink-300 rounded-full">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">
          What Our Customers Say
        </h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl"
          >
            <div className="mb-4 text-pink-500 dark:text-pink-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 font-serif italic">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  </>
  )
}

export default Testimonials