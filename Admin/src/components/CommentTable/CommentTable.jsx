import { Table, Button } from "antd";

const CommentTable = ({ comments, onDelete }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "ID sản phẩm",
      dataIndex: "id",
    },
    {
      title: "Email",
      dataIndex: "userId.name",
      render: (text, record) => record.userId?.name || "N/A", // Safely access userId.name
    },

    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Rating",
      dataIndex: "rating",
    },
    {
      title: "Content",
      dataIndex: "comment",
      ellipsis: true, // This will truncate long content with "..."
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Button onClick={() => onDelete(record._id)} type="link">
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={comments}
      columns={columns}
      rowKey={(record) => record._id} // Assumes "id" is unique for each comment
      className="comment-management-table"
      pagination={{ pageSize: 7 }}
      scroll={{ x: true }}
      tableLayout="fixed"
    />
  );
};

export default CommentTable;
