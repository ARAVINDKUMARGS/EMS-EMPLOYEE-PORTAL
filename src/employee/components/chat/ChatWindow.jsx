import "./ChatWindow.css";
import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ChatMenu from "./ChatMenu";
import ClearChatModal from "./ClearChatModal";

function ChatWindow({
  selectedContact,
  messages,
  sendMessage,
  clearConversation,
}) {
  const chatMessages = messages[selectedContact.id] || [];

  const bottomRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  return (
    <div className="chat-window">

      {/* Header */}

      <div className="chat-window-header">

        <div className="chat-user">

          <div className="header-avatar">
            {selectedContact.avatar}
          </div>

          <div className="header-info">
            <h3>{selectedContact.name}</h3>

            <span>
              {selectedContact.online
                ? "Online"
                : "Offline"}
            </span>
          </div>

        </div>

        <div className="header-icons relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
          >
            <FiMoreVertical />
          </button>

          {/* Three Dot Menu */}

          <ChatMenu
            showMenu={showMenu}
            onClearChat={() => {
              setShowMenu(false);
              setShowClearModal(true);
            }}
          />

        </div>

      </div>

      {/* Clear Chat Modal */}

      <ClearChatModal
        show={showClearModal}
        onCancel={() => setShowClearModal(false)}
        onConfirm={() => {
          clearConversation();
          setShowClearModal(false);
        }}
      />

      {/* Messages */}

      <div className="messages-area">

        <div className="today">
          Today
        </div>

        {chatMessages.length === 0 ? (

          <div
            style={{
              color: "#94a3b8",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            No messages yet
          </div>

        ) : (

          chatMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))

        )}

        <div ref={bottomRef}></div>

      </div>

      {/* Input */}

      <MessageInput
        sendMessage={sendMessage}
      />

    </div>
  );
}

export default ChatWindow;