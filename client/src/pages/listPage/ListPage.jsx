import Card from "../../components/card/Card";
import FilterComponent from "../../components/filter/FilterComponent";
import Map from "../../components/map/Map";
import { useLocation } from "react-router-dom";

import "./listPage.scss";

import { useQuery } from "react-query";
import { fetchAllPosts } from "../../lib/apiContext";
import Loader from "../../components/loader/loader";
function ListPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city");
  const type = queryParams.get("type");
  const minPrice = queryParams.get("minPrice");
  const maxPrice = queryParams.get("maxPrice");
  const property = queryParams.get("property");

  // Constructing query string
  const query = {
    type: type || "",
    city: city || "",
    minPrice: minPrice || 0,
    maxPrice: maxPrice || 1000000,
    Property: property || "",
  };
  const queryString = new URLSearchParams(query).toString();

  const { data: posts, isLoading } = useQuery({
    queryFn: () => fetchAllPosts(queryString), // Passing stringified query here
    queryKey: "posts",
  });

  return (
    <section className="listPage">
      <div className="listContainer">
        <FilterComponent />
        {isLoading ? (
          <Loader />
        ) : posts && posts.length > 0 ? (
          <div className="cardsContainer">
            {posts.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="noListingsMessage">
            No listings available, try another entry.
          </div>
        )}
      </div>
      <div className="mapContainer">
        {isLoading ? <Loader /> : <Map items={posts} />}
      </div>
    </section>
  );
}

export default ListPage;
