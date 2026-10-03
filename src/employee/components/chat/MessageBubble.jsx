import { FiCheck, FiFileText } from "react-icons/fi";

function MessageBubble({ message }) {
  const isSent = message.type === "sent";

  return (
    <div className={`flex w-full px-4 ${isSent ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm ${
          isSent
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground"
        }`}
      >
        {/* Text Message */}
        {message.messageType === "text" || !message.messageType ? (
          <p>{message.text}</p>
        ) : (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 underline underline-offset-2"
          >
            <FiFileText />
            <span>{message.fileName}</span>
          </a>
        )}

        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
          <span>{message.time}</span>

          {message.type === "sent" && (
            <div className="flex items-center">
              {message.status === "sent" && <FiCheck className="size-3" />}

              {message.status === "delivered" && (
                <span className="flex">
                  <FiCheck className="size-3" />
                  <FiCheck className="-ml-1.5 size-3" />
                </span>
              )}

              {message.status === "read" && (
                <span className="flex text-info">
                  <FiCheck className="size-3" />
                  <FiCheck className="-ml-1.5 size-3" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;