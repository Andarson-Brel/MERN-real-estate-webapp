import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/authContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadwidget/UploadWidget";

function ProfileUpdatePage() {
  const authContext = useContext(AuthContext);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { currentUser, upDateUser } = authContext || {};
  const [avatar, setAvatar] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password, userName } = Object.fromEntries(formData);
    try {
      const res = await apiRequest.put(`/user/${currentUser.id}`, {
        userName,
        email,
        password,
        avatar: avatar[0],
      });

      if (res.status === 200) {
        upDateUser(res.data);
        navigate("/profile");
      }
    } catch (error) {
      setErr(error.message);
    }
  };
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="userName"
              type="text"
              defaultValue={currentUser.userName}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          {err && <span>{err}</span>}
          <button>Update</button>
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={
            avatar[0] ||
            currentUser.avatar ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
          alt=""
          className="avatar"
        />

        <UploadWidget
          uwConfig={{
            cloudName: "dbandara",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
