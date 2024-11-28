import React, { useEffect, useState } from "react";
import {
  Modal,
  Table,
  Button,
  Form,
  DatePicker,
  InputNumber,
  notification,
  Select,
} from "antd";
import axios from "axios";

const { RangePicker } = DatePicker;

const DiscountModal = ({ isVisible, onClose }) => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]); // State for product colors

  useEffect(() => {
    if (isVisible) {
      fetchDiscounts();
      fetchProducts();
    }
  }, [isVisible]);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/discount/getAll");
      console.log(response.data); // Log the response data for debugging
      setDiscounts(response.data);
    } catch (error) {
      console.error(error); // Log the error message for debugging
      notification.error({
        message: "Error",
        description: "Failed to fetch discounts.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/shoe/getShoes");
      setProducts(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch products.",
      });
    }
  };

  // Fetch available colors when a product is selected
  const handleProductChange = (productId) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      // Extract unique colors from the images field
      const productColors = selectedProduct.images.map((image) => image.color);
      setColors([...new Set(productColors)]); // Remove duplicates by using a Set
    }
  };

  const handleCreateDiscount = async (values) => {
    const { productId, color, discountPercentage, dateRange } = values;
    const [startDate, endDate] = dateRange;

    const payload = {
      productId,
      color,
      discountPercentage,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      await axios.post("http://localhost:3000/discount/addDiscount", payload);
      notification.success({
        message: "Success",
        description: "Discount created successfully!",
      });
      fetchDiscounts(); // Refresh the discount list
      setIsCreateVisible(false);
    } catch (error) {
      // Check if the error response exists and show the correct error message
      const errorMessage =
        error.response && error.response.data
          ? error.response.data
          : "An error occurred";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    }
  };

  const handleDeleteDiscount = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/discount/deleteDiscount/${id}`);
      notification.success({
        message: "Success",
        description: "Discount deleted successfully!",
      });
      fetchDiscounts(); // Refresh the discount list
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete discount.",
      });
    }
  };

  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Discount (%)",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Activated",
      dataIndex: "active",
      key: "active",
      render: (active) => (active ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          danger
          onClick={() => handleDeleteDiscount(record._id)} // Call handleDeleteDiscount with the discount ID
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Danh Sách Khuyến Mãi"
        visible={isVisible}
        onCancel={onClose}
        footer={
          <Button type="primary" onClick={() => setIsCreateVisible(true)}>
            Tạo Khuyến Mãi
          </Button>
        }
        width={800}
      >
        <Table
          dataSource={discounts}
          columns={columns}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      {/* Modal Tạo Khuyến Mãi */}
      <Modal
        title="Tạo Khuyến Mãi"
        visible={isCreateVisible}
        onCancel={() => setIsCreateVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateDiscount}>
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: "Please select a product!" }]}
          >
            <Select
              showSearch
              placeholder="Select a product"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleProductChange} // Fetch colors when product is selected
            >
              {products.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please select a color!" }]}
          >
            <Select
              placeholder="Select a color"
              disabled={colors.length === 0} // Disable if no colors are available
            >
              {colors.map((color, index) => (
                <Select.Option key={index} value={color}>
                  {color}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="discountPercentage"
            label="Discount Percentage"
            rules={[
              { required: true, message: "Please input Discount Percentage!" },
            ]}
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: "Please select date range!" }]}
          >
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DiscountModal;
