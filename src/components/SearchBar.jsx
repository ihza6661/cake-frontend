import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Search, X } from "lucide-react"; // Import Lucide icons

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(AppContext);
  const [visible, setVisible] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  return showSearch && visible ? (
    <div className="text-center pt-20">
  <div className="inline-flex items-center justify-center glass shadow-sm px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 outline-none bg-transparent text-lg tracking-wide text-gray-700"
      type="text"
      placeholder="Cari Kue..."
    />
    <Search className="w-6 h-6 text-pink-500 cursor-pointer transition-transform transform hover:scale-110" />
  </div>
  <X
    onClick={() => setShowSearch(false)}
    className="inline w-6 h-6 text-gray-500 cursor-pointer hover:text-pink-500 transition-colors"
  />
</div>

  ) : null;
};

export default SearchBar;
