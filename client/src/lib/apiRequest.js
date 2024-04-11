import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://mern-real-estate-webapp-api.onrender.com/api",
  withCredentials: true,
});
export default apiRequest;
