import React from "react";

export function ChatBox({
  stuQuestion,
  onStuQuestionChange,
  messages,
  isLoading,
  onSendChat
}) {
  return (
    <div className="chatbox">
      <h3 className="text-[#9be15d] text-3xl flex flex-col items-center justify-center mb-4">Ask about the current step</h3>

      <div className="chat-messages">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`chat-row ${m.role === "user" ? "user" : "ai"}`}
          >
            <div className={`chat-bubble ${m.role}`}>
              <div className="chat-meta">
                {m.role === "user" ? "You" : "AI Tutor"}
              </div>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-row ai">
            <div className="chat-bubble ai">
              <div className="chat-meta">AI Tutor</div>
              <div>Thinking...</div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={stuQuestion}
          onChange={(e) => onStuQuestionChange(e.target.value)}
          placeholder="Ask your question about this step..."
        />
        <button type="button" className="chat-send-btn" onClick={onSendChat}>
          Send
        </button>
      </div>
    </div>
  );
}

