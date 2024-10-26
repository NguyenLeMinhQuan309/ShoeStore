import {
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  Button,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios

const { Option } = Select;

const ProductForm = ({ newProduct, setNewProduct }) => {
  const [imageInputs, setImageInputs] = useState(
    Array.isArray(newProduct.images) && newProduct.images.length > 0
      ? newProduct.images
      : [{ imageUrls: [], color: "" }]
  );

  const [categories, setCategories] = useState([]); // State for categories
  const [brands, setBrands] = useState([]); // State for brands

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/category/getAll"
        );
        setCategories(response.data); // Set the fetched categories
      } catch (error) {
        console.error("There was an error fetching categories!", error);
      }
    };

    // Fetch brands from the API
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/brand/getAll" // Adjust the endpoint as needed
        );
        setBrands(response.data); // Set the fetched brands
      } catch (error) {
        console.error("There was an error fetching brands!", error);
      }
    };

    fetchCategories();
    fetchBrands(); // Call the fetchBrands function
  }, []);

  useEffect(() => {
    setImageInputs(
      Array.isArray(newProduct.images) && newProduct.images.length > 0
        ? newProduct.images
        : [{ imageUrls: [], color: "" }]
    );
  }, [newProduct.images]);

  const handleImageChange = (index, fileList) => {
    const updatedImages = [...imageInputs];

    updatedImages[index].imageUrls = fileList.map((file) => ({
      uid: file.uid,
      name: file.name,
      status: file.status || "done",
      url: file.url,
      originFileObj: file.originFileObj,
    }));

    setImageInputs(updatedImages);
    setNewProduct((prevState) => ({
      ...prevState,
      images: updatedImages,
    }));
  };

  const handleColorChange = (index, value) => {
    const updatedImages = [...imageInputs];
    updatedImages[index].color = value;

    setImageInputs(updatedImages);
    setNewProduct((prevState) => ({
      ...prevState,
      images: updatedImages,
    }));
  };

  const addImageField = () => {
    const newImageInput = { imageUrls: [], color: "" };
    setImageInputs((prevInputs) => [...prevInputs, newImageInput]);
    setNewProduct((prevState) => ({
      ...prevState,
      images: [...prevState.images, newImageInput],
    }));
  };

  return (
    <Form layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              value={newProduct.category}
              onChange={(value) => {
                setNewProduct({ ...newProduct, category: value });
              }}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Brand"
            rules={[{ required: true, message: "Please select a brand" }]}
          >
            <Select
              value={newProduct.brand}
              onChange={(value) => {
                setNewProduct({ ...newProduct, brand: value });
              }}
            >
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.name}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Size"
            required
            rules={[{ required: true, message: "Please select product sizes" }]}
          >
            <Select
              mode="multiple"
              value={newProduct.size}
              onChange={(value) => {
                setNewProduct({ ...newProduct, size: value.map(Number) });
              }}
              placeholder="Select sizes"
            >
              <Option value={36}>36</Option>
              <Option value={37}>37</Option>
              <Option value={38}>38</Option>
              <Option value={39}>39</Option>
              <Option value={40}>40</Option>
              <Option value={41}>41</Option>
              <Option value={42}>42</Option>
              <Option value={43}>43</Option>
              <Option value={44}>44</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Price"
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <InputNumber
              min={0}
              value={newProduct.price}
              onChange={(value) =>
                setNewProduct({ ...newProduct, price: value })
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Stock"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <InputNumber
              min={0}
              value={newProduct.stock}
              onChange={(value) =>
                setNewProduct({ ...newProduct, stock: value })
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Images Upload Section */}
      {imageInputs.map((input, index) => (
        <Row gutter={16} key={index}>
          <Col span={12}>
            <Form.Item
              label={`Upload Images for Color ${index + 1}`}
              rules={[{ required: true }]}
            >
              <Upload
                multiple
                listType="picture-card"
                fileList={input.imageUrls}
                onChange={({ fileList }) => handleImageChange(index, fileList)}
                beforeUpload={() => false}
              >
                {input.imageUrls.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={`Color for Images ${index + 1}`}
              rules={[{ required: true }]}
            >
              <Input
                value={input.color || ""}
                onChange={(e) => handleColorChange(index, e.target.value)}
                placeholder="Enter color"
              />
            </Form.Item>
          </Col>
        </Row>
      ))}
      <Row gutter={16}>
        <Col span={24}>
          <Button onClick={addImageField} type="dashed" block>
            Add More Images
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Form.Item label="Description">
            <Input.TextArea
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              rows={4}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ProductForm;
