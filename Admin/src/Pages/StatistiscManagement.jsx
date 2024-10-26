import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Card } from "antd";
import axios from "axios";

const { Title } = Typography;

const StatisticsProductPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          "http:/localhost:3000/statistics/product"
        ); // URL API
        setData(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (text) => <span>${text.toFixed(2)}</span>, // Định dạng tiền tệ
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Product Statistics</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Card>
          <Table dataSource={data} columns={columns} rowKey="productId" />
        </Card>
      )}
    </div>
  );
};

export default StatisticsProductPage;
