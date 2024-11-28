import React, { useState, useEffect } from "react";
import { Card, Col, Row, Select, List } from "antd";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const { Option } = Select;

const Dashboard = () => {
  const currentDate = new Date();
  const [topProducts, setTopProducts] = useState([]);
  const [timeFrame, setTimeFrame] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);

  // useEffect(() => {
  //   // Fetch top-selling products from API
  //   const fetchTopProducts = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3000/statistics/topselling"
  //       );
  //       setTopProducts(response.data);
  //     } catch (error) {
  //       console.error("Error fetching top-selling products:", error);
  //     }
  //   };

  //   fetchTopProducts();
  // }, []);

  useEffect(() => {
    // Fetch total products from API
    const fetchTotalProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/shoe/totalproducts"
        );
        setTotalProducts(response.data.total);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    };

    fetchTotalProducts();
  }, []);

  useEffect(() => {
    // Fetch total users from API
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/totalusers"
        );
        setTotalUsers(response.data.total);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalUsers();
  }, []);

  useEffect(() => {
    // Fetch total reviews from API
    const fetchTotalReviews = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/review/totalreviews"
        );
        setTotalReviews(response.data.total);
      } catch (error) {
        console.error("Error fetching total reviews:", error);
      }
    };

    fetchTotalReviews();
  }, []);

  useEffect(() => {
    // Fetch revenue data for the selected time frame
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/statistics/revenue?timeFrame=${timeFrame}&date=${
            timeFrame === "month"
              ? selectedYear + "-" + selectedMonth
              : selectedYear
          }`
        );
        console.log(response.data);

        setRevenueData(response.data.revenue); // Assuming the response is in { revenue: [] }
        setTopProducts(response.data.topSellingProducts);
        console.log("Revenue Data:", response.data.revenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, [timeFrame, selectedMonth, selectedYear]);

  useEffect(() => {
    // Fetch revenue data for the selected time frame
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/statistics/revenueoverview?timeFrame=${timeFrame}&date=${
            timeFrame === "month"
              ? selectedYear + "-" + selectedMonth
              : selectedYear
          }`
        );
        console.log(response.data);

        // setRevenueData(response.data.revenue); // Assuming the response is in { revenue: [] }
        // setTopProducts(response.data.topSellingProducts);
        console.log("Revenue Data:", response.data.revenue);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, [timeFrame, selectedMonth, selectedYear]);
  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);

    // Update available months for the selected year (this logic can be dynamic)
    setAvailableMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  };

  const getRevenueForMonth = (month) => {
    if (!Array.isArray(revenueData)) return 0;

    const paddedMonth = String(month).padStart(2, "0");
    const targetDatePrefix = `${selectedYear}-${paddedMonth}`;

    // Check if `day` exists and add its revenue
    return revenueData.reduce((total, item) => {
      if (item.day) {
        const itemDate = `${selectedYear}-${paddedMonth}-${String(
          item.day
        ).padStart(2, "0")}`;
        if (itemDate.startsWith(targetDatePrefix)) {
          return total + (item.revenue || 0);
        }
      }
      return total;
    }, 0);
  };
  const formatYearlyRevenueData = (data) => {
    const monthlyRevenue = Array(12).fill(0); // Initialize an array of 12 months with 0 revenue

    data.forEach((item) => {
      const monthIndex = item.month - 1; // Adjust for zero-based month index
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyRevenue[monthIndex] += item.revenue || 0; // Add the revenue to the corresponding month
      }
    });

    // Return only months with non-zero revenue
    return monthlyRevenue
      .map((revenue, index) => ({
        time: `Month ${index + 1}`, // Display 'Month X'
        revenue,
      }))
      .filter((item) => item.revenue > 0); // Filter out months with no revenue
  };

  // Chuyển đổi dữ liệu revenueData theo ngày
  const formatRevenueData = (data) => {
    return data
      .filter((item) => item.revenue > 0) // Filter out items with no revenue
      .map((item) => {
        const dayStr = item.day ? `Day ${item.day}` : `Month ${item.month}`;
        return { time: dayStr, revenue: item.revenue };
      });
  };

  // Thêm đoạn trong phần hiển thị BarChart
  const formattedRevenueData =
    timeFrame === "month"
      ? formatRevenueData(revenueData)
      : formatYearlyRevenueData(revenueData);
  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
  return (
    <div style={{ padding: "20px" }}>
      <h1>DashBoard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Products" bordered={false}>
            <h2>{totalProducts}</h2>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Users" bordered={false}>
            <h2>{totalUsers}</h2>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Reviews" bordered={false}>
            <h2>{totalReviews}</h2>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={16}>
          <Card title="Revenue Overview" bordered={false}>
            <Select
              defaultValue="month"
              style={{ width: 200, marginBottom: "20px" }}
              onChange={handleTimeFrameChange}
            >
              <Option value="month">Monthly</Option>
              <Option value="year">Yearly</Option>
            </Select>
            {timeFrame === "year" && (
              <Select
                value={selectedYear}
                style={{ width: 200, marginBottom: "20px", marginLeft: "10px" }}
                onChange={handleYearChange}
              >
                <Option value="2024">2024</Option>
                <Option value="2023">2023</Option>
                <Option value="2022">2022</Option>
                <Option value="2021">2021</Option>
              </Select>
            )}
            {timeFrame === "month" && (
              <>
                <Select
                  value={selectedYear}
                  style={{
                    width: 200,
                    marginBottom: "20px",
                    marginLeft: "10px",
                  }}
                  onChange={handleYearChange}
                >
                  <Option value="2024">2024</Option>
                  <Option value="2023">2023</Option>
                  <Option value="2022">2022</Option>
                  <Option value="2021">2021</Option>
                </Select>

                <Select
                  value={selectedMonth}
                  style={{
                    width: 200,
                    marginBottom: "20px",
                    marginLeft: "10px",
                  }}
                  onChange={handleMonthChange}
                >
                  {availableMonths.map((month) => (
                    <Option key={month} value={month.toString()}>
                      {month}
                    </Option>
                  ))}
                </Select>
              </>
            )}
            {timeFrame === "month" && (
              <h3>
                Total Revenue for {selectedMonth}:{" "}
                {getRevenueForMonth(selectedMonth) === 0
                  ? "No revenue"
                  : formatNumber(getRevenueForMonth(selectedMonth))}{" "}
                VND
              </h3>
            )}
            {timeFrame === "year" && (
              <h3>
                Total Revenue for {selectedYear}:{" "}
                {revenueData.reduce(
                  (total, item) => formatNumber(total + item.revenue),
                  0
                ) || "No revenue"}{" "}
                VND
              </h3>
            )}

            {Array.isArray(revenueData) &&
            revenueData.length > 0 &&
            !revenueData.every((item) => item.revenue === 0) ? (
              <BarChart
                width={800}
                height={310}
                data={formattedRevenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" /> {/* time là "Month X" */}
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#1890ff" />
              </BarChart>
            ) : (
              <p>No revenue data available for the selected period</p>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Revenue Products" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={topProducts}
              renderItem={(product) => (
                <List.Item>
                  <List.Item.Meta
                    title={product.name}
                    description={`Revenue: ${formatNumber(
                      product.totalRevenue
                    )} VND, Quantity: ${product.totalQuantitySold}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
