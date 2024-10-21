// Hero.js
import React from "react";
import heroimg from "../../assets/hero/hero.png";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/target-page");
  };
  return (
    <div className="hero">
      <img src={heroimg} alt="Hero Image" className="hero-image" />
      <button className="hero-button" onClick={handleButtonClick}>
        Mua ngay
      </button>
    </div>
  );
};

export default Hero;
