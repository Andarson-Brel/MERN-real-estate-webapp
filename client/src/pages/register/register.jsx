import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
function Register() {
  const [erromsg, setErrormsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    try {
      const response = await apiRequest.post(`/auth/register`, {
        userName,
        password,
        email,
      });
      // console.log(response);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setErrormsg(error.response.data.message);
    }
  };
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="email" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          {erromsg && <span>{erromsg}</span>}
          <button>Register</button>
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
