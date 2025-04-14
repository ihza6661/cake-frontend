import React from "react";

const PolicySection = ({ title, content }) => (
  <section className="mt-6">
    <h3 className="text-xl font-semibold text-pink-600">{title}</h3>
    <ul className="text-gray-700 leading-relaxed mt-2 list-none">
      {content.split("\n").map((item, index) => (
        <li key={index} className="mb-2">
          {item}
        </li>
      ))}
    </ul>
  </section>
);

const OurPolicy = () => {
  return (
    <div className="p-6 bg-pink-100 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl lg:text-4xl font-bold text-pink-700 mb-4">
        Kebijakan Kami
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Di Yulita Cakes, kami berkomitmen untuk menyajikan kue segar dan
        berkualitas tinggi dengan layanan terbaik. Harap tinjau kebijakan kami
        sebelum melakukan pemesanan.
      </p>

      <PolicySection
        title="Kebijakan Pemesanan"
        content={`- Pemesanan harus dilakukan setidaknya 24 jam sebelumnya untuk kue khusus.
- Pembayaran penuh diperlukan saat melakukan pemesanan.
- Setelah pesanan dibuat, perubahan tidak dapat dilakukan dalam waktu 12 jam sebelum pengiriman.`}
      />

      <PolicySection
        title="Kebijakan Pengiriman"
        content={`- Kami mengirimkan dalam radius 10 mil dari toko kami.
- Slot pengiriman tergantung pada ketersediaan, dan keterlambatan karena keadaan yang tidak terduga akan diinformasikan.
- Pelanggan harus memastikan seseorang tersedia untuk menerima kue pada waktu yang dipilih.`}
      />

      <PolicySection
        title="Pengembalian & Pembatalan"
        content={`- Pembatalan yang dilakukan 48 jam sebelum pengiriman berhak mendapatkan pengembalian dana penuh.
- Pesanan yang dibatalkan dalam waktu 24 jam sebelum pengiriman tidak dapat dikembalikan.
- Jika ada masalah dengan produk, harap hubungi kami dalam waktu 2 jam setelah menerima kue.`}
      />

      <PolicySection
        title="Kebersihan & Kualitas"
        content={`- Semua kue dibuat dalam lingkungan yang higienis dengan bahan berkualitas tinggi.
- Kami tidak menggunakan pengawet; kue sebaiknya dikonsumsi dalam waktu 24-48 jam untuk rasa terbaik.
- Informasi alergi tersedia berdasarkan permintaan.`}
      />

      <p className="text-gray-800 mt-6 font-medium text-center">
        Terima kasih telah memilih Yulita Cakes! 🍰 Kami siap melayani Anda.
      </p>
    </div>
  );
};

export default OurPolicy;
