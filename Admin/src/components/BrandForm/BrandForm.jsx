import { Form, Input } from "antd";
import React from "react";

const BrandForm = ({ newBrand, setNewBrand }) => {
  return (
    <Form layout="vertical">
      <Form.Item
        label="Brand ID"
        rules={[{ required: true, message: "Please enter a brand ID" }]}
      >
        <Input
          value={newBrand.id}
          onChange={(e) => setNewBrand({ ...newBrand, id: e.target.value })}
        />
      </Form.Item>

      <Form.Item
        label="Brand Name"
        rules={[{ required: true, message: "Please enter a brand name" }]}
      >
        <Input
          value={newBrand.name}
          onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
        />
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
