import { Modal, Button } from "antd";
import ProductForm from "../ProductForm/ProductForm";
import { useState } from "react";

const AddProductModal = ({
  showPopup,
  setShowPopup,
  newProduct,
  setNewProduct,
  addProduct,
  isEditing,
}) => {
  const [loading, setLoading] = useState(false); // Manage loading state

  const handleAddProduct = async () => {
    setLoading(true); // Start loading
    await addProduct(newProduct); // Await the addProduct function
    setLoading(false); // Stop loading after the operation
  };

  return (
    <Modal
      title={isEditing ? "Edit Product" : "Add New Product"}
      visible={showPopup}
      onCancel={() => setShowPopup(false)}
      width={800}
      footer={[
        <Button key="cancel" onClick={() => setShowPopup(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading} // Show loading state
          onClick={handleAddProduct} // Call the handleAddProduct function
        >
          {isEditing ? "Update Product" : "Add Product"}
        </Button>,
      ]}
      className="product-management-modal"
    >
      <ProductForm
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        isEditMode={isEditing}
      />
    </Modal>
  );
};

export default AddProductModal;
