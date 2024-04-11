import Slider from "../../components/slider/Slider";
import "./singlePage.scss";
import Map from "../../components/map/Map";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import { useMutation, useQuery } from "react-query";
import { fetchSinglePost } from "../../lib/apiContext";
import Loader from "../../components/loader/loader";
import axios from "axios";
import apiRequest from "../../lib/apiRequest";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";

function SinglePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const { data: post, isLoading } = useQuery({
    queryFn: () => fetchSinglePost(id),
    queryKey: "post",
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (post && post.isSaved !== undefined) {
      setSaved(post.isSaved);
    }
  }, [post]);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/user/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };
  // console.log(post.userId);
  return isLoading ? (
    <Loader />
  ) : (
    <section className="singlePage">
      <div className="details">
        <div className="wrapper">
          {post && <Slider images={post?.images} />}
          <div className="info">
            <div className="top">
              <div className="post">
                <h2>{post?.title}</h2>
                <div className="address">
                  <img src="pin.png" alt="" />
                  <span>{post?.address}</span>
                </div>
                <div className="price">${post?.price}</div>
              </div>
              <Link to={"/profile"}>
                <div className="user">
                  <img src={post?.user?.avatar} alt="" />
                  <span>{post?.user?.userName}</span>
                </div>
              </Link>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post?.postDetail?.description),
              }}
            >
              {/* <p>{post?.postDetail?.description}</p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <h3 className="title">General</h3>
          <div className="listVertical">
            <div className="feature">
              <img src="./utility.png" alt="" />
              <div className="featText">
                <span>Utilities</span>
                <p>{post?.postDetail?.utilities} is responsible</p>
              </div>
            </div>
            <div className="feature">
              <img src="./pet.png" alt="" />
              <div className="featText">
                <span>Pet policy</span>
                <p>{post?.postDetail?.pet}</p>
              </div>
            </div>
            <div className="feature">
              <img src="./fee.png" alt="" />
              <div className="featText">
                <span>Property Fees</span>
                <p>{post?.postDetail?.income}</p>
              </div>
            </div>
          </div>

          <h3 className="title">Sizes</h3>
          <div className="sizes">
            <div className="size">
              <img src="./size.png" alt="" />
              <span>{post?.postDetail?.size}sqft</span>
            </div>
            <div className="size">
              <img src="./bed.png" alt="" />
              <span>{post?.bedroom} Bedrooms</span>
            </div>
            <div className="size">
              <img src="./bath.png" alt="" />
              <span>{post?.bathroom} Bathrooms</span>
            </div>
          </div>

          <h3 className="title">Near by Places</h3>
          <div className="listHorizontal">
            {post?.postDetail?.school && (
              <div className="feature">
                <img src="./school.png" alt="" />
                <div className="featText">
                  <span>School</span>
                  <p>{post?.postDetail?.school}m away</p>
                </div>
              </div>
            )}
            {post?.postDetail?.bus && (
              <div className="feature">
                <img src="./pet.png" alt="" />
                <div className="featText">
                  <span>Bus STop</span>
                  <p>{post?.postDetail?.bus}m away</p>
                </div>
              </div>
            )}
            {post?.postDetail?.restaurant && (
              <div className="feature">
                <img src="./fee.png" alt="" />
                <div className="featText">
                  <span>Restuarant</span>
                  <p>{post?.postDetail?.restaurant}m away</p>
                </div>
              </div>
            )}
          </div>
          <h3 className="title">Locations</h3>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          {currentUser && currentUser.id !== post.userId && (
            <div className="buttonContainer">
              <Link
                to={`/profile?receiverId=${post.userId}&productTitle=${post.title}&type=${post.type}`}
              >
                <button>
                  <img src="./chat.png" alt="" /> Send a Message
                </button>
              </Link>
              <button
                onClick={handleSave}
                style={{ backgroundColor: saved ? "#fece51" : "white" }}
                className="saveBtn"
              >
                <img src="./save.png" alt="" /> {saved ? "Unsave" : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SinglePage;
