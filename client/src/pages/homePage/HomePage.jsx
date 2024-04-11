// import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
// import { AuthContext } from "../../context/authContext";
import "./homePage.scss";

function HomePage() {
  // const authContext = useContext(AuthContext);
  // const { currentUser } = authContext || {};

  // console.log(currentUser);
  return (
    <section className="homePage">
      <div className="textContainer">
        <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
        <p className="description">
          Discover your dream property effortlessly with our intuitive platform.
          From chic urban apartments to spacious suburban homes, we offer a
          diverse range of listings tailored to your needs. Let our expert team
          guide you through every step of your real estate journey.
        </p>
        <SearchBar />
        <div className="boxes">
          <div className="box">
            <h1>16+</h1>
            <h2>Years Of Experience</h2>
          </div>
          <div className="box">
            <h1>200</h1>
            <h2>Award Gained</h2>
          </div>
          <div className="box">
            <h1>1200+</h1>
            <h2>Property Ready</h2>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="./bg.png" alt="" />
      </div>
    </section>
  );
}

export default HomePage;
