import { useQuery } from "react-query";

import Card from "../card/Card";
import "./list.scss";
import { fetchUserPost } from "../../lib/apiContext";
import Loader from "../loader/loader";
function List({ userId }) {
  const { data: posts, isLoading } = useQuery({
    queryFn: () => fetchUserPost(userId),
    queryKey: "userListing",
  });
  // console.log(posts[0]);
  return isLoading ? (
    <Loader />
  ) : (
    <section className="listing">
      {posts?.map((item) => (
        <Card item={item} key={item.id} />
      ))}
    </section>
  );
}

export default List;
