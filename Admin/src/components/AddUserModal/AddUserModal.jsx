import { Modal, Button } from "antd";
import UserForm from "../UserForm/UserForm";

const AddUserModal = ({
  showPopup,
  setShowPopup,
  newUser,
  setNewUser,
  addUser,
  address,
  setAddress,
  isEditing,
}) => {
  return (
    <Modal
      title={isEditing ? "Edit User" : "Add New User"}
      visible={showPopup}
      onCancel={() => setShowPopup(false)}
      footer={[
        <Button key="cancel" onClick={() => setShowPopup(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={addUser}>
          {isEditing ? "Save Changes" : "Add User"}
        </Button>,
      ]}
      className="user-management-modal"
    >
      <UserForm
        newUser={newUser}
        setNewUser={setNewUser}
        address={address}
        setAddress={setAddress}
        isEditing={isEditing}
      />
    </Modal>
  );
};

export default AddUserModal;
