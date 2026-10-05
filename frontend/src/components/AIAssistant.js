import React, { useState } from "react";
import api from "../services/api";
import "./AIAssistant.css";

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
  if (!message.trim()) {
    return;
  }

  const userMessage = message;

  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userMessage
    }
  ]);

  setMessage("");
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    console.log("JWT token exists:", !!token);

    const response = await api.post(
      "/ai/chat",
      {
        message: userMessage
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: response.data.answer
      }
    ]);

  } catch (error) {
    console.error("AI error:", error);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text:
          error.response?.data?.message ||
          "AI request failed"
      }
    ]);
  } finally {
    setLoading(false);
  }
};

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* AI Button */}
      <button
        className="ai-button"
        onClick={() => setIsOpen(true)}
      >
        🤖
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-panel">

          <div className="ai-header">
            <div>
              <h3>Policy AI Assistant</h3>
              <span>Ask about company policies</span>
            </div>

            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="ai-messages">

            {messages.length === 0 && (
              <div className="welcome-message">
                <h4>How can I help?</h4>

                <p>
                  Ask me about company policies.
                </p>

                <div className="suggestion">
                  "What is the work from home policy?"
                </div>

                <div className="suggestion">
                  "How many days can employees work from home?"
                </div>
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={index}
                className={
                  item.sender === "user"
                    ? "message user-message"
                    : "message ai-message"
                }
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="message ai-message">
                Thinking...
              </div>
            )}

          </div>

          <div className="ai-input-area">

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about company policies..."
              rows="2"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
            >
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIAssistant;