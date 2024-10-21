import React from "react";
import { Layout } from "antd";
import "./Footer.css"; // Import the CSS file for styling
const { Footer } = Layout;
const footer = () => {
  return (
    <Layout>
      <Footer className="footer">
        <div className="footer-content">
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
          <p>&copy; 2024 MySite. All rights reserved.</p>
          <p>
            <a href="#terms">Terms of Service</a> |{" "}
            <a href="#privacy">Privacy Policy</a>
          </p>
        </div>
      </Footer>
    </Layout>
  );
};

export default footer;
