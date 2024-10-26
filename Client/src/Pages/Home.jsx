// home.js
import React from "react";
import Hero from "../Components/Hero/Hero"; // Nhập Hero component
import NewSection from "../Components/NewSection/NewSection"; // Nhập NewSection component
import Popular from "../Components/Popular/Popular";
import "./Css/main.css";
const home = () => {
  return (
    <div className="main">
      <Hero />
      <div className="component">
        <NewSection />
      </div>
      {/* <Popular /> */}
    </div>
  );
};

export default home;
