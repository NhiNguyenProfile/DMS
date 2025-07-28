import { useState } from "react";
import Text from "../Text";
import Button from "../Button";
import { X } from "lucide-react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title, 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  showCommentInput = true,
  commentLabel = "Comment",
  commentPlaceholder = "Enter your comment...",
  commentRequired = false
}) => {
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    if (commentRequired && showCommentInput && !comment.trim()) {
      alert("Comment is required");
      return;
    }
    onConfirm(comment);
    setComment("");
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Text variant="heading" size="lg" weight="semibold">
            {title}
          </Text>
          <Button variant="ghost" size="small" onClick={handleClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Message */}
        <Text variant="body" color="muted" className="mb-4">
          {message}
        </Text>

        {/* Comment Input */}
        {showCommentInput && (
          <div className="mb-4">
            <Text variant="body" weight="medium" className="mb-2">
              {commentLabel}
              {commentRequired && <span className="text-red-500 ml-1">*</span>}
            </Text>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={commentPlaceholder}
              className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
