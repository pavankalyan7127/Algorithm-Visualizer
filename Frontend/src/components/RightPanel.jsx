import React from "react";
import { AlgoDetails } from "./AlgoDetails.jsx";
import { ChatBox } from "./ChatBox.jsx";

export function RightPanel({
  data,
  rightPanelTab,
  onChangeTab,
  stuQuestion,
  onStuQuestionChange,
  messages,
  isChatLoading,
  onSendChat
}) {
  return (
    <aside className="main-right">
      <div className="right-tabs">
        <button
          className={rightPanelTab === "algo" ? "right-tab active" : "right-tab"}
          onClick={() => onChangeTab("algo")}
        >
          Algo explain
        </button>
        <button
          className={rightPanelTab === "chat" ? "right-tab active" : "right-tab"}
          onClick={() => onChangeTab("chat")}
        >
          Chatbot
        </button>
      </div>

      <div className="right-panel-body">
        {!data ? (
          <p className="placeholder-text">
            Generate an algorithm first to see its explanation and chat with the
            tutor.
          </p>
        ) : rightPanelTab === "algo" ? (
          <AlgoDetails data={data} />
        ) : (
          <ChatBox
            stuQuestion={stuQuestion}
            onStuQuestionChange={onStuQuestionChange}
            messages={messages}
            isLoading={isChatLoading}
            onSendChat={onSendChat}
          />
        )}
      </div>
    </aside>
  );
}

