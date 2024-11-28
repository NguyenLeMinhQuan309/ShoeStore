import React from "react";
import Hero from "../Components/Hero/Hero";
import NewSection from "../Components/NewSection/NewSection";
import Suggestions from "../Components/Suggestion/Suggestion";
import FeaturedBrands from "../Components/Category/Category";
import "./Css/main.css";

const Home = () => {
  // Kiểm tra nếu người dùng đã đăng nhập (kiểm tra xem email có tồn tại trong localStorage không)
  const isLoggedIn = localStorage.getItem("user") !== null;

  return (
    <div>
      <Hero />
      <FeaturedBrands />
      <div className="component">
        <NewSection />
      </div>
      {/* Chỉ hiển thị Suggestions nếu người dùng đã đăng nhập */}
      {isLoggedIn && <Suggestions />}
    </div>
  );
};

export default Home;
