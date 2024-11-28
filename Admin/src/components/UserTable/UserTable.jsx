import React, { useState } from "react";
import { Table, Button, Input } from "antd";

const { Search } = Input;

const UserTable = ({ users, onEdit }) => {
  const [searchEmail, setSearchEmail] = useState(""); // State for email search
  const [sorter, setSorter] = useState({ field: null, order: null }); // State for sorting

  // Filtered and sorted users
  const filteredUsers = users.filter(
    (user) => user.email?.toLowerCase().includes(searchEmail.toLowerCase()) // Safely access email
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sorter.field || !sorter.order) return 0;

    const orderMultiplier = sorter.order === "ascend" ? 1 : -1;

    if (sorter.field === "name" || sorter.field === "role") {
      return a[sorter.field]?.localeCompare(b[sorter.field]) * orderMultiplier; // Safely access fields
    }

    if (sorter.field === "gender") {
      return (a.gender - b.gender) * orderMultiplier;
    }

    return 0;
  });

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (text) => (
        <img
          src={
            text
              ? text
              : "http://localhost:3000/user/uploads/userImage/default_avatar.png"
          }
          alt="User Image"
          className="user-management-avatar"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true, // Enable sorting
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
      title: "Role",
      dataIndex: "role",
      sorter: true, // Enable sorting
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender) =>
        gender === 1 ? "Nam" : gender === 0 ? "Nữ" : "Không xác định",
      sorter: true, // Enable sorting
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Button onClick={() => onEdit(record)}>Edit</Button>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.order) {
      setSorter({ field: sorter.field, order: sorter.order });
    } else {
      setSorter({ field: null, order: null });
    }
  };

  return (
    <div>
      {/* Email Search */}
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by email"
          allowClear
          onSearch={(value) => setSearchEmail(value)}
          onChange={(e) => setSearchEmail(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* User Table */}
      <Table
        dataSource={sortedUsers}
        columns={columns}
        rowKey="_id" // Ensure that _id is unique
        className="user-management-table"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        tableLayout="fixed"
        onChange={handleTableChange} // Handle sorting
      />
    </div>
  );
};

export default UserTable;
