import { ConfirmDialog } from "@/components/common/ConfirmDialog";

function ClearChatModal({ show, onCancel, onConfirm }) {
  return (
    <ConfirmDialog
      open={show}
      onOpenChange={(next) => !next && onCancel()}
      title="Clear Conversation"
      description="Are you sure you want to clear this conversation? This action cannot be undone."
      confirmLabel="Clear"
      cancelLabel="Cancel"
      destructive
      onConfirm={onConfirm}
    />
  );
}

export default ClearChatModal;