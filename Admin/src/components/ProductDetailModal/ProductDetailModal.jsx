import { Modal, Button, Table, Input, message } from "antd";
import { useState } from "react";
import axios from "axios";

const ProductDetailsModal = ({
  visible,
  product,
  onClose,
  setProduct,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuantities, setEditedQuantities] = useState({});

  const colorSizeData = product
    ? product.images.map((img) => ({
        color: img.color,
        price: img.price, // Assuming `price` is present in each `img` object
        sizes: img.stock.map((stockItem) => ({
          size: stockItem.size,
          quantity: stockItem.quantity,
        })),
      }))
    : [];

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setEditedQuantities({});
  };

  const handleQuantityChange = (color, size, value) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        [size]: value,
      },
    }));
  };
  console.log(product);

  const handleUpdate = async () => {
    const updates = [];

    Object.keys(editedQuantities).forEach((color) => {
      Object.keys(editedQuantities[color]).forEach((size) => {
        const quantity = parseInt(editedQuantities[color][size], 10);

        updates.push({
          color,
          size: Number(size),
          quantity,
        });
      });
    });

    try {
      await Promise.all(
        updates.map(async ({ color, size, quantity }) => {
          await axios.put("http://localhost:3000/shoe/updateStock", {
            id: product.id,
            stock: { color, size, quantity },
          });
        })
      );

      // Hiển thị thông báo thành công
      message.success("Stock updated successfully");

      // Cập nhật lại danh sách sản phẩm sau khi cập nhật stock
      const updatedProducts = await axios.get(
        "http://localhost:3000/shoe/getShoes"
      );
      setProduct(updatedProducts.data);

      // Đặt lại các trạng thái sau khi cập nhật thành công
      setIsEditing(false);
      setEditedQuantities({});
      onClose();
    } catch (error) {
      console.error("Error updating stock:", error);
      message.error("Failed to update stock");
    }
  };

  const columns = [
    { title: "Color", dataIndex: "color", key: "color" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${formatNumber(price)} VND`,
    },
    ...[
      ...new Set(
        colorSizeData.flatMap((item) => item.sizes.map((s) => s.size))
      ),
    ].map((size) => ({
      title: `Size ${size}`,
      dataIndex: size,
      key: size,
      render: (_, record) => {
        const sizeData = record.sizes.find((s) => s.size === size);
        const quantity = sizeData ? sizeData.quantity : "-";

        if (isEditing) {
          return (
            <Input
              type="number"
              min="0"
              value={editedQuantities[record.color]?.[size] ?? quantity}
              onChange={(e) =>
                handleQuantityChange(record.color, size, e.target.value)
              }
            />
          );
        }

        return quantity;
      },
    })),
  ];
  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
  return (
    <Modal
      title="Product Details"
      visible={visible}
      onCancel={onClose}
      width={800}
      footer={[
        !isEditing && (
          <Button key="edit1" onClick={() => onEdit(product)}>
            Edit Product
          </Button>
        ),
        <Button key="edit" onClick={handleEditToggle}>
          {isEditing ? "Cancel" : "Edit Stock"}
        </Button>,
        isEditing && (
          <Button key="update" type="primary" onClick={handleUpdate}>
            Update
          </Button>
        ),
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {product && (
        <div>
          <p>
            <strong>ID:</strong> {product.id} &nbsp;&nbsp;{" "}
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand} &nbsp;&nbsp;{" "}
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Stock Details:</strong>
          </p>
          <Table
            dataSource={colorSizeData}
            columns={columns}
            pagination={false}
            rowKey="color"
            bordered
            style={{ marginBottom: "1rem" }}
          />
          <div>
            <strong>Images:</strong>
            <div>
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.imageUrls[0]}
                  alt={`Product Image - ${img.color}`}
                  style={{ width: "100px", height: "100px", margin: "5px" }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductDetailsModal;
