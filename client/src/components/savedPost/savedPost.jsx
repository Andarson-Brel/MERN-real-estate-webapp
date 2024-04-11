import { useQuery } from "react-query";
import { fetchSavedPosts } from "../../lib/apiContext";
import Card from "../card/Card";
import "../list/list.scss";
import Loader from "../loader/loader";

function SavedPost({ userId }) {
  const { data: posts, isLoading } = useQuery({
    queryFn: () => fetchSavedPosts(userId),

    queryKey: "savedPost",
  });
  // console.log(posts);
  //   console.log(posts[0].post);

  return isLoading ? (
    <Loader />
  ) : (
    <section className="listing">
      {posts?.map((item) => {
        const post = item.post;
        return <Card item={post} key={item.id} />;
      })}
    </section>
  );
}
export default SavedPost;
