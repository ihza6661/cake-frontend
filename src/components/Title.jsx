import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-4 items-center pr-4 pb-4">
      <h2 className="text-3xl sm:text-3xl text-gray-600 dark:text-gray-300 font-semibold font-serif">
        {text1}{" "}
        <span className="text-pink-600 bg-dark:bg-[#3B0D28]">{text2}</span>
      </h2>
    </div>
  );
};

export default Title;
