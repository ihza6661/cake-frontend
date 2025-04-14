import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-semibold text-pink-700 bg-pink-100 border-4 border-pink-300 rounded-lg p-6 m-10 shadow-md">
        🎂 Berlangganan Sekarang & Dapatkan Diskon 20%! 🍰
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-2/3 md:w-2/4 lg:w-[80%] xl:w-[80%] flex flex-col sm:flex-row items-center gap-3 mx-auto my-6 border border-pink-300 bg-pink-50 rounded-xl p-4 shadow-md max-w-[900px]"
      >
        <input
          className="w-full sm:flex-1 outline-none p-3 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400"
          type="email"
          placeholder="Masukkan email untuk mendapatkan Diskon 🎂"
          required
        />
        <button
          className="w-full sm:w-auto px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition mt-3 sm:mt-0"
          type="submit"
        >
          🍰 BERLANGGANAN
        </button>
      </form>

      <div className="bg-gray-200 text-gray-800 text-center py-6 px-4">
        <img src="/banner2.webp" alt="banner" className="w-full h-auto" />
      </div>

      <div className="bg-gray-200 text-gray-800 text-center py-6 px-4">
        <img src="/banner1.webp" alt="banner" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default NewsletterBox;
