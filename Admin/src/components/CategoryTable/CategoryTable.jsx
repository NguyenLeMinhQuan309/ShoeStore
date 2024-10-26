import { Table, Button } from "antd";

const CategoryTable = ({ categories, onDelete }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Button onClick={() => onDelete(record.id)} type="link">
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={categories}
      columns={columns}
      rowKey={(record) => record.id} // Assumes "id" is unique for each category
      className="category-management-table"
      pagination={{ pageSize: 7 }}
      scroll={{ x: true }}
      tableLayout="fixed"
    />
  );
};

export default CategoryTable;
