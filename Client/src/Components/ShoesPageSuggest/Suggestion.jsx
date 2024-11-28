import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "../Item/Item"; // Import ProductItem component
import { Spin } from "antd"; // Sử dụng Ant Design cho loading icon
import "./Suggestion.css";

const Suggestions = ({ id }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/shoe/recommendByItem/${id}`
        ); // Replace with actual endpoint
        setSuggestions(response.data.recommendedProducts);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchSuggestions();
  }, [id]); // Chỉ gọi lại khi `id` thay đổi

  return (
    <div className="itemsuggestions">
      <h1>Sản phẩm liên quan</h1>
      {loading ? ( // Hiển thị icon loading khi đang tải
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="itemsuggestions-list">
          {suggestions.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
