import { Form, Input, Button } from "antd";
import React from "react";

const CategoryForm = ({ newCategory, setNewCategory }) => {
  return (
    <Form layout="vertical">
      <Form.Item
        label="Category ID"
        rules={[{ required: true, message: "Please enter a category ID" }]}
      >
        <Input
          value={newCategory.id}
          onChange={(e) =>
            setNewCategory({ ...newCategory, id: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item
        label="Category Name"
        rules={[{ required: true, message: "Please enter a category name" }]}
      >
        <Input
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
      </Form.Item>

      {/* <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Submit
        </Button>
      </Form.Item> */}
    </Form>
  );
};

export default CategoryForm;
