import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./css/layout.scss";
import HomePage from "./pages/homePage/HomePage";
import ListPage from "./pages/listPage/ListPage";
import SinglePage from "./pages/singlePage/SinglePage";
// import Login from "./pages/loginPage/Login";

import Profile from "./pages/profile/Profile";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import ProfileUpdatePage from "./pages/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./pages/newPostPage/newPostPage";
import Chat from "./components/chat/Chat";
import About from "./pages/about/About";
import Agent from "./pages/agen/Agent";
function App() {
  return (
    <div className="layout">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/:id" element={<SinglePage />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/update" element={<ProfileUpdatePage />} />
          <Route path="/profile:receiverId" component={Chat} />
          <Route path="/about" element={<About />} />
          <Route path="/agents" element={<Agent />} />
          <Route path="/new-post" element={<NewPostPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
