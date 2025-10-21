import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContextObject";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBarRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setVisible(location.pathname.includes("/kue"));
  }, [location]);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockProducts = [
          "Red Velvet Cake", "Chocolate Fudge Cake", "Vanilla Bean Cake",
          "Strawberry Shortcake", "Lemon Meringue Pie", "Black Forest Cake",
          "Carrot Cake", "Cheesecake", "Opera Cake", "Tiramisu"
        ];
        const filteredSuggestions = mockProducts.filter(product =>
          product.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        resolve(filteredSuggestions);
      }, 300);
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchSuggestions(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/kue?search=${suggestion}`);
    setShowSearch(false);
  };

  const handleSearchSubmit = () => {
    if (search.trim()) {
      navigate(`/kue?search=${search}`);
      setShowSearch(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarRef]);


  return showSearch && visible ? (
    <div className="text-center pt-20 relative" ref={searchBarRef}>
      <div className="inline-flex items-center justify-center glass shadow-sm px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={handleSearchChange}
          onFocus={() => search.length > 1 && setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit();
            }
          }}
          className="flex-1 outline-none bg-transparent text-lg tracking-wide text-gray-700"
          type="text"
          placeholder="Cari Kue..."
        />
        <Search
          className="w-6 h-6 text-pink-500 cursor-pointer transition-transform transform hover:scale-110"
          onClick={handleSearchSubmit}
        />
      </div>
      <X
        onClick={() => {
          setShowSearch(false);
          setSearch("");
          setSuggestions([]);
        }}
        className="inline w-6 h-6 text-gray-500 cursor-pointer hover:text-pink-500 transition-colors"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-3/4 sm:w-1/2 z-10 border border-gray-200 dark:border-gray-700">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 text-left text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) : null;
};

export default SearchBar;