import { useState } from "react";
import "./slider.scss";

function Slider({ images }) {
  const [imgIndex, setImgIndex] = useState(null);

  const changeSlide = (direction) => {
    if (!images || images.length === 0) {
      return; // No images to display
    }

    if (direction === "left") {
      if (imgIndex === 0) {
        setImgIndex(images.length - 1);
      } else {
        setImgIndex(imgIndex - 1);
      }
    } else {
      if (imgIndex === images.length - 1) {
        setImgIndex(0);
      } else {
        setImgIndex(imgIndex + 1);
      }
    }
  };

  return (
    <div className="slider">
      {imgIndex !== null && images && images.length > 0 && (
        <div className="fullSlider">
          <div className="arrow" onClick={() => changeSlide("left")}>
            <img src="./arrow.png" alt="" />
          </div>
          <div className="fullimg">
            <img src={images[imgIndex]} alt="" />
          </div>
          <div className="arrow " onClick={() => changeSlide("right")}>
            <img src="./arrow.png" alt="" className="right" />
          </div>
          <div className="close" onClick={() => setImgIndex(null)}>
            X
          </div>
        </div>
      )}
      {images && images.length > 0 && (
        <div className="bigImg">
          <img src={images[0]} alt="" onClick={() => setImgIndex(0)} />
        </div>
      )}
      {images && images.length > 1 && (
        <div className="smImg">
          {images.slice(1).map((image, i) => (
            <img
              src={image}
              alt=""
              key={i}
              onClick={() => setImgIndex(i + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Slider;
