import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";
function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });
  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="search-bar">
      <div className="type">
        <button
          onClick={() => switchType("buy")}
          className={`${query.type === "buy" ? "active" : ""}`}
        >
          Buy
        </button>
        <button
          onClick={() => switchType("rent")}
          className={`${query.type === "rent" ? "active" : ""}`}
        >
          Rent
        </button>
      </div>
      <form>
        <input
          type="text"
          name="city"
          placeholder="city"
          onChange={handleChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min-price"
          min={0}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="max-price"
          min={0}
          onChange={handleChange}
        />
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
        >
          <button>
            <img src="./search.png" alt="" />
          </button>
        </Link>
      </form>
    </section>
  );
}

export default SearchBar;
