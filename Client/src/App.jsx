import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios"; // Import axios to make HTTP requests
import Header from "./Components/Header/Header";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import Description from "./Pages/Description";
import Cart from "./Pages/Cart";
import UserInfo from "./Pages/UserInfo";
import ShoesPage from "./Pages/ShoesPage"; // Rename to ShoesPage for clarity

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/shoe/getShoes"); // Update with your actual API endpoint
        setProducts(response.data); // Assume the API returns an array of products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a loading state while products are being fetched
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
          <Route path="/user-information" element={<UserInfo />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
