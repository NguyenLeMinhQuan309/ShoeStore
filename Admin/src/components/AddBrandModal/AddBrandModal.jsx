import { Modal, Button } from "antd";
import BrandForm from "../BrandForm/BrandForm"; // Import the BrandForm component
import { useState } from "react";

const AddBrandModal = ({
  showPopup,
  setShowPopup,
  newBrand,
  setNewBrand,
  addBrand,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddBrand = async () => {
    setLoading(true);
    await addBrand(newBrand); // Call addBrand function instead of addCategory
    setLoading(false);
  };

  return (
    <Modal
      title="Add New Brand"
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
          onClick={handleAddBrand}
        >
          Add Brand
        </Button>,
      ]}
      className="brand-management-modal"
    >
      <BrandForm newBrand={newBrand} setNewBrand={setNewBrand} />
    </Modal>
  );
};

export default AddBrandModal;
