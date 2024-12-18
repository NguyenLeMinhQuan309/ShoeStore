import {
  Form,
  Input,
  Row,
  Col,
  Select,
  InputNumber,
  Button,
  Upload,
  notification,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";

const { Option } = Select;

const ProductForm = ({ newProduct, setNewProduct, isEditMode, onSave }) => {
  const [imageInputs, setImageInputs] = useState(
    Array.isArray(newProduct.images) && newProduct.images.length > 0
      ? newProduct.images
      : [{ imageUrls: [], color: "", price: 0, stock: [] }]
  );
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/category/getAll"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:3000/brand/getAll");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    setImageInputs(
      Array.isArray(newProduct.images) && newProduct.images.length > 0
        ? newProduct.images
        : [{ imageUrls: [], color: "", stock: [] }]
    );
  }, [newProduct.images]);

  const handleGenderChange = (value) => {
    const sizes = value === 1 ? [39, 40, 41, 42, 43, 44] : [36, 37, 38, 39, 40];
    const updatedImages = imageInputs.map((image) => ({
      ...image,
      stock: sizes.map((size) => ({ size, quantity: 0 })),
    }));

    setImageInputs(updatedImages);
    setNewProduct({
      ...newProduct,
      gender: value,
      images: updatedImages,
    });
  };

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
    const newImageInput = {
      imageUrls: [],
      color: "",
      stock:
        newProduct.gender === 1
          ? [39, 40, 41, 42, 43, 44].map((size) => ({ size, quantity: 0 }))
          : [36, 37, 38, 39, 40].map((size) => ({ size, quantity: 0 })),
    };
    setImageInputs((prevInputs) => [...prevInputs, newImageInput]);
    setNewProduct((prevState) => ({
      ...prevState,
      images: [...prevState.images, newImageInput],
    }));
  };

  const removeImageField = (index) => {
    const updatedImages = [...imageInputs];
    updatedImages.splice(index, 1);

    setImageInputs(updatedImages);
    setNewProduct((prevState) => ({
      ...prevState,
      images: updatedImages,
    }));
  };

  return (
    <Form layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Gender" required>
            <Select value={newProduct.gender} onChange={handleGenderChange}>
              <Option value={1}>Male</Option>
              <Option value={2}>Female</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Product Name" required>
            <Input
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Category" required>
            <Select
              value={newProduct.category}
              onChange={(value) =>
                setNewProduct({ ...newProduct, category: value })
              }
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Brand" required>
            <Select
              value={newProduct.brand}
              onChange={(value) =>
                setNewProduct({ ...newProduct, brand: value })
              }
            >
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.name}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Image Inputs */}
      {imageInputs.map((input, index) => (
        <Row gutter={16} key={index}>
          <Col span={12}>
            {!isEditMode ? (
              <Form.Item label={`Images for Color ${index + 1}`} required>
                <Upload
                  multiple
                  listType="picture-card"
                  fileList={input.imageUrls}
                  onChange={({ fileList }) =>
                    handleImageChange(index, fileList)
                  }
                  beforeUpload={() => false}
                >
                  {input.imageUrls.length >= 6 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            ) : (
              <Form.Item label={`Images for Color ${index + 1}`}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <img
                    src={input.imageUrls[0]}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Form.Item>
            )}
          </Col>
          <Col span={10}>
            {!isEditMode ? (
              <Form.Item label={`Color for Images ${index + 1}`} required>
                <Input
                  value={input.color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  placeholder="Enter color"
                />
              </Form.Item>
            ) : (
              <span>Color: {input.color}</span>
            )}
            <Form.Item label={`Price for Color ${index + 1}`} required>
              <InputNumber
                min={0}
                value={input.price}
                onChange={(value) => {
                  const updatedImages = [...imageInputs];
                  updatedImages[index].price = value;
                  setImageInputs(updatedImages);
                  setNewProduct((prevState) => ({
                    ...prevState,
                    images: updatedImages,
                  }));
                }}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            {!isEditMode ? (
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={() => removeImageField(index)}
                style={{ marginTop: "40px" }}
              />
            ) : (
              ""
            )}
          </Col>
        </Row>
      ))}

      <Row gutter={16}>
        <Col span={24}>
          {!isEditMode ? (
            <Button onClick={addImageField} type="dashed" block>
              Add More Images
            </Button>
          ) : (
            ""
          )}
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
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
