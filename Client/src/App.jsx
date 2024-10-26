import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios"; // Import axios to make HTTP requests
import Header from "./Components/Header/Header";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import Description from "./Pages/Description";
import Cart from "./Pages/Cart";
import ShoesPage from "./Pages/ShoesPage"; // Rename to ShoesPage for clarity

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/shoe/getShoes"); // Update with your actual API endpoint
        setProducts(response.data); // Assume the API returns an array of products
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a loading state while products are being fetched
  }

  if (error) {
    return <div>{error}</div>; // Display error message if any
  }

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route
            path="/product/:id"
            element={<ShoesPage products={products} />} // Pass products to ShoesPage
          />
          <Route path="/description" element={<Description />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
