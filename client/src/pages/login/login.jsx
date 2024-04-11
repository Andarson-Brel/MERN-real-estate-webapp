import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/authContext";

function Login() {
  const [erromsg, setErrormsg] = useState("");
  const authContext = useContext(AuthContext);

  const { upDateUser } = authContext || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // isLoading(true);
    const formData = new FormData(e.target);
    const userName = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await apiRequest.post(
        "/auth/login",

        {
          userName,
          password,
        }
      );

      if (response.status === 200) {
        upDateUser(response.data);
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
      setErrormsg(error.response.data.message);
    }
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          {erromsg && <span>{erromsg}</span>}
          <button>Login</button>
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
