import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "../Item/Item"; // Import ProductItem component
import { Spin } from "antd"; // Sử dụng Ant Design cho loading icon
import "./Suggestion.css";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const fetchSuggestions = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user.email;
      try {
        const response = await axios.get(
          `http://localhost:3000/shoe/recommendShoes/${email}`
        );
        setSuggestions(response.data.recommendedProducts);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="suggestions">
      <h1>Gợi ý cho bạn</h1>
      {loading ? ( // Hiển thị icon loading khi đang tải
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="suggestions-list">
          {suggestions.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
