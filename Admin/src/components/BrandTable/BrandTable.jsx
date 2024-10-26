import { Table, Button } from "antd";

const BrandTable = ({ brands, onDelete }) => {
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
      dataSource={brands}
      columns={columns}
      rowKey={(record) => record.id} // Assumes "id" is unique for each brand
      className="brand-management-table"
      pagination={{ pageSize: 7 }}
      scroll={{ x: true }}
      tableLayout="fixed"
    />
  );
};

export default BrandTable;
