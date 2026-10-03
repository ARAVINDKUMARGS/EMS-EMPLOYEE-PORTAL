import { FiTrash2 } from "react-icons/fi";

function ChatMenu({ showMenu, onClearChat }) {
  if (!showMenu) return null;

  return (
    <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-elegant">
      <button
        onClick={onClearChat}
        className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-destructive hover:bg-destructive/10"
      >
        <FiTrash2 className="size-4" />
        <span>Clear Chat</span>
      </button>
    </div>
  );
}

export default ChatMenu;