import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";

import "./profile.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect } from "react";
import SavedPost from "../../components/savedPost/savedPost";
function Profile() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [searchParams, setSearchPrams] = useSearchParams();
  const receiverId = searchParams.get("receiverId");

  const { currentUser, upDateUser } = authContext || {};

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);
  const handleLogout = async () => {
    try {
      const res = await apiRequest.post("/auth/logout");
      // console.log(res);
      if (res.status === 200) {
        upDateUser(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    currentUser && (
      <section className="profilePage">
        <section className="details">
          <div className="title">
            <h1>User Information</h1>
            <Link to={"/profile/update"}>
              <button>Edit Profile</button>
            </Link>
          </div>
          <div className="info">
            <img
              src={
                currentUser.avatar
                  ? currentUser.avatar
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              alt=""
            />
            <span>
              Username: <b>{currentUser.userName}</b>
            </span>
            <span>
              email:<b> {currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="title">
            <h1>My Listing </h1>
            <Link to="/new-post">
              <button>Create New Post</button>
            </Link>
          </div>
          <List userId={currentUser?.id} />
          <div className="title">
            <h1>Saved Listing</h1>
          </div>
          <SavedPost userId={currentUser?.id} />
        </section>
        <section className="chatContainer">
          <Chat />
        </section>
      </section>
    )
  );
}

export default Profile;
