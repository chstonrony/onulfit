import { Message } from "@/lib/types";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="bubble-enter flex justify-end">
        <div
          className="max-w-[78%] px-5 py-3"
          style={{
            fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
            fontWeight: 300,
            fontSize: "14px",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
            wordBreak: "keep-all",
            color: "var(--t-txt)",
            backgroundColor: "var(--t-bu)",
            borderRadius: "20px 20px 5px 20px",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="bubble-enter flex justify-start">
      {message.content && (
        <div
          className="max-w-[82%] px-5 py-3"
          style={{
            fontFamily: "var(--font-noto-sans), 'Apple SD Gothic Neo', sans-serif",
            fontWeight: 300,
            fontSize: "14px",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
            wordBreak: "keep-all",
            color: "var(--t-txt)",
            backgroundColor: "var(--t-bai)",
            border: "1px solid var(--t-baib)",
            borderRadius: "20px 20px 20px 5px",
          }}
        >
          {message.content}
        </div>
      )}
    </div>
  );
}
