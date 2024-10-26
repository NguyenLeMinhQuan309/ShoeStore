import { Modal, Button } from "antd";
import CategoryForm from "../CategoryForm/CategoryForm";
import { useState } from "react";

const AddCategoryModal = ({
  showPopup,
  setShowPopup,
  newCategory,
  setNewCategory,
  addCategory,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    setLoading(true);
    await addCategory(newCategory);
    setLoading(false);
  };

  return (
    <Modal
      title="Add New Category"
      visible={showPopup}
      onCancel={() => setShowPopup(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowPopup(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleAddCategory}
        >
          Add Category
        </Button>,
      ]}
      className="category-management-modal"
    >
      <CategoryForm newCategory={newCategory} setNewCategory={setNewCategory} />
    </Modal>
  );
};

export default AddCategoryModal;
