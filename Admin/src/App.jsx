import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar/Sidebar";
import UserManagement from "./Pages/UserManagement";
import ProductManagement from "./Pages/ProductManagement";

const App = () => {
  const [collapsed, setCollapsed] = useState(true);

  // Mở sidebar khi rê chuột vào
  const handleMouseEnter = () => {
    setCollapsed(false); // Mở sidebar
  };

  // Đóng sidebar khi rê chuột ra
  const handleMouseLeave = () => {
    setCollapsed(true); // Đóng sidebar
  };

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Sidebar collapsed={collapsed} />
        </div>
        <Layout>
          <Layout.Content style={{ margin: "20px" }}>
            <Routes>
              <Route path="/user" element={<UserManagement />} />
              <Route path="/product" element={<ProductManagement />} />
              {/* Thêm các route khác nếu cần */}
            </Routes>
          </Layout.Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;