import { Table, Button } from "antd";

const UserTable = ({ users, onEdit }) => {
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (text) => (
        <img src={text} alt="User Image" className="user-management-avatar" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender) =>
        gender === 1 ? "Nam" : gender === 0 ? "Nữ" : "Không xác định",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Button onClick={() => onEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={users}
      columns={columns}
      rowKey="_id" // Đảm bảo rằng _id là duy nhất
      className="user-management-table"
      pagination={{ pageSize: 5 }}
      scroll={{ x: true }}
      tableLayout="fixed"
    />
  );
};

export default UserTable;
