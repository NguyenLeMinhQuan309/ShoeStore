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

const { Option } = Select;

const ProductForm = ({ newProduct, setNewProduct }) => {
  const [imageInputs, setImageInputs] = useState(
    Array.isArray(newProduct.images) && newProduct.images.length > 0
      ? newProduct.images
      : [{ imageUrls: [], color: "" }]
  );

  useEffect(() => {
    setImageInputs(
      Array.isArray(newProduct.images) && newProduct.images.length > 0
        ? newProduct.images
        : [{ imageUrls: [], color: "" }]
    );
  }, [newProduct.images]);

  const handleImageChange = (index, fileList) => {
    const updatedImages = [...imageInputs];

    // Update imageUrls for the current index
    updatedImages[index].imageUrls = fileList.map((file) => ({
      uid: file.uid,
      name: file.name,
      status: file.status || "done", // Ensure status is set to "done" or default
      url: file.url, // Use the blob URL for display purposes
      originFileObj: file.originFileObj, // Keep the original file object if it exists
    }));

    setImageInputs(updatedImages);

    // Update newProduct.images to reflect the latest image inputs
    setNewProduct((prevState) => ({
      ...prevState,
      images: updatedImages,
    }));

    console.log(updatedImages); // Log the updated images to verify structure
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
              mode="multiple"
              value={newProduct.category}
              onChange={(value) => {
                setNewProduct({ ...newProduct, category: value });
              }}
            >
              <Option value="depquaingang">Dép quai ngang</Option>
              <Option value="depxongon">Dép xỏ ngón</Option>
              <Option value="giaybongro">Giày bóng rỗ</Option>
              <Option value="giaychaybo">Giày chạy bộ</Option>
              <Option value="giaydabong">Giày đá bóng</Option>
              <Option value="giaydibo">Giày đi bộ</Option>
              <Option value="giaysandal">Giày sandal</Option>
              <Option value="giaysneakers">Giày sneakers</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Brand"
            rules={[{ required: true, message: "Please enter a brand" }]}
          >
            <Select
              mode="multiple"
              value={newProduct.brand}
              onChange={(value) => {
                setNewProduct({ ...newProduct, brand: value });
              }}
            >
              <Option value="Adidas">Adidas</Option>
              <Option value="Hoka">Hoka</Option>
              <Option value="Nike">Nike</Option>
              <Option value="Columbia">Columbia</Option>
              <Option value="Skechers">Skechers</Option>
              <Option value="On running">On Running</Option>
              <Option value="Saucony">Saucony</Option>
              <Option value="New Balance">New Balances</Option>
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
