import React, { useState, useEffect } from "react";
import "./ProductItem.css";
import Item from "../Item/Item";

const ProductItem = ({
  products,
  selectedCategories,
  selectedBrands,
  selectedColors,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter products based on selected categories, brands, and colors
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 || // If no categories selected, match all
      selectedCategories.includes(product.category.value);
    const matchesBrand =
      selectedBrands.length === 0 || // If no brands selected, match all
      selectedBrands.includes(product.brand);
    const matchesColor =
      selectedColors.length === 0 || // If no colors selected, match all
      selectedColors.includes(product.color);

    return matchesCategory && matchesBrand && matchesColor; // Return true only if all conditions are met
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent invalid page change
    setCurrentPage(pageNumber); // Update current page
  };

  useEffect(() => {
    // Reset to the first page whenever filters change
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, selectedColors]);

  if (filteredProducts.length === 0) {
    return <div>No products found</div>; // Display a message if no products are available
  }

  return (
    <div className="product-area">
      <div className="product">
        {currentItems.map((product) => (
          <Item key={product.id} product={product} /> // Use product.id or another unique identifier
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
