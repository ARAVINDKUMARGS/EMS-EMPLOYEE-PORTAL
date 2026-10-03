import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import { FiSmile, FiPaperclip, FiMic, FiSend, FiX } from "react-icons/fi";

function MessageInput({ sendMessage }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef();

  const handleSend = () => {
    if (!text.trim() && !selectedFile) return;

    // Send File
    if (selectedFile) {
      sendMessage({
        messageType: "file",
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileUrl: URL.createObjectURL(selectedFile),
      });
    }

    // Send Text
    if (text.trim()) {
      sendMessage({
        messageType: "text",
        text: text.trim(),
      });
    }

    setText("");
    setSelectedFile(null);
    setShowEmoji(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const chooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFile = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
      {selectedFile && (
        <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          <span>📎 {selectedFile.name}</span>
          <button onClick={() => setSelectedFile(null)} className="hover:text-foreground">
            <FiX />
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 border-t border-border bg-card px-4 py-3">
        {/* Emoji */}
        <div className="relative">
          <button
            className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <FiSmile className="size-5" />
          </button>

          {showEmoji && (
            <div className="absolute bottom-full left-0 z-30 mb-2">
              <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        {/* Attachment */}
        <button
          className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={chooseFile}
        >
          <FiPaperclip className="size-5" />
        </button>

        <input type="file" hidden ref={fileInputRef} onChange={handleFile} />

        {/* Input */}
        <input
          value={text}
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="flex-1 rounded-full border border-input bg-input/30 px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />

        {/* Mic */}
        <button className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
          <FiMic className="size-5" />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <FiSend className="size-4" />
        </button>
      </div>
    </>
  );
}

export default MessageInput;