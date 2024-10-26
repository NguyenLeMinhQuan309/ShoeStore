import { Modal, Button } from "antd";
import OrderForm from "../OrderForm/OrderForm"; // Adjust this import based on your folder structure

const AddOrderModal = ({
  showPopup,
  setShowPopup,
  newOrder,
  setNewOrder,
  addOrder,
  isEditing,
}) => {
  return (
    <Modal
      title={isEditing ? "Edit Order" : "Add New Order"}
      visible={showPopup}
      onCancel={() => setShowPopup(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowPopup(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={addOrder}>
          {isEditing ? "Save Changes" : "Add Order"}
        </Button>,
      ]}
      className="order-management-modal"
    >
      <OrderForm
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        isEditing={isEditing}
      />
    </Modal>
  );
};

export default AddOrderModal;
