import { useState, useEffect } from "react";
import { Button, Card, Typography, notification } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import CommentTable from "../components/CommentTable/CommentTable"; // Adjust path as needed
// import AddCommentModal from "../components/AddCommentModal/AddCommentModal"; // Adjust path as needed
import "./css/CommentManagement.css"; // Update CSS path

const { Title } = Typography;

const CommentManagementComponent = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    id: "",
    userId: "",
    title: "",
    comment: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  // Fetch comments data
  useEffect(() => {
    axios
      .get("http://localhost:3000/review/getAll") // Update with actual comment endpoint
      .then((response) => setComments(response.data))
      .catch((error) => console.error("Error fetching comments!", error));
    console.log(comments);
  }, []);

  // Add new comment
  const addComment = () => {
    if (!newComment.id || !newComment.title || !newComment.content) {
      notification.error({
        message: "Error",
        description: "All required fields must be filled correctly.",
      });
      return;
    }

    axios
      .post("http://localhost:3000/comment/create", newComment) // Update with actual create endpoint
      .then((response) => {
        const addedComment = response.data.comment;
        if (addedComment) {
          setComments((prev) => [...prev, addedComment]);
          setShowPopup(false);
          setNewComment({ id: "", title: "", content: "" });
          notification.success({
            message: "Success",
            description: "Comment added successfully!",
          });
        } else {
          notification.error({
            message: "Error",
            description: "Failed to add comment. No data returned.",
          });
        }
      })
      .catch((error) => {
        console.error("Error adding comment!", error);
        notification.error({
          message: "Error",
          description: "Failed to add comment.",
        });
      });
  };

  // Delete comment
  const deleteComment = (_id) => {
    axios
      .delete(`http://localhost:3000/review/delete/${_id}`) // Update with actual delete endpoint
      .then(() => {
        setComments((prev) => prev.filter((comment) => comment._id !== _id));
        notification.success({
          message: "Success",
          description: "Comment deleted successfully!",
        });
      })
      .catch((error) => {
        console.error("Error deleting comment!", error);
        notification.error({
          message: "Error",
          description: "Failed to delete comment.",
        });
      });
  };

  return (
    <div className="comment-management-container">
      <Title level={2} className="comment-management-title">
        Comment Management
      </Title>
      {/* <Button
        type="primary"
        onClick={() => {
          setNewComment({ id: "", title: "", content: "" });
          setShowPopup(true);
        }}
        icon={<PlusOutlined />}
        className="comment-management-add-button"
      >
        Add Comment
      </Button>
      <AddCommentModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
      /> */}
      <Card>
        <CommentTable comments={comments} onDelete={deleteComment} />
      </Card>
    </div>
  );
};

export default CommentManagementComponent;
