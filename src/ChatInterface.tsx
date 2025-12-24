import React, { useState, useRef, useEffect } from 'react';

export interface Message {
  senderId: string;
  messageId: string;
  message: string;
  date: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onDeleteMessage: (id: string) => void;
  isConnected: boolean;
  currentUserId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onDeleteMessage,
  isConnected,
  currentUserId
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-content">
          <h1>Messenger</h1>
          <div className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </header>

      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">No messages yet. Say hello!</div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.senderId === currentUserId;
            return (
              <div key={msg.messageId} className={`message-wrapper ${isMyMessage ? 'sent' : 'received'}`}>
                <div className="message-bubble glass">
                  <div className="message-content">{msg.message}</div>
                  <div className="message-meta">
                    <span className="timestamp">{formatDate(msg.date)}</span>
                   {isMyMessage && (
                      <button
                        onClick={() => onDeleteMessage(msg.messageId)}
                        className="delete-btn"
                        title="Delete message"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-area glass">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
          className="chat-input"
        />
        <button type="submit" disabled={!isConnected || !inputText.trim()} className="send-btn">
          Send
        </button>
      </form>

      <style>{`
        .chat-container {
          width: 100%;
          max-width: 600px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .chat-header {
          padding: 20px;
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          padding: 4px 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
        }

        .status-badge.connected { color: #4ade80; }
        .status-badge.disconnected { color: #ef4444; }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: currentColor;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          color: var(--text-secondary);
          margin-top: 40px;
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 80%;
        }

        .message-wrapper.sent {
          align-self: flex-end;
          align-items: flex-end;
        }

        .message-wrapper.received {
          align-self: flex-start;
          align-items: flex-start;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          position: relative;
          word-break: break-word;
        }

        .message-wrapper.sent .message-bubble {
          background: var(--msg-sent);
          border-bottom-right-radius: 4px;
        }

        .message-wrapper.received .message-bubble {
          background: var(--msg-received);
          border-bottom-left-radius: 4px;
        }

        .message-meta {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
          font-size: 0.7rem;
          opacity: 0.7;
        }

        .delete-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          opacity: 0.5;
          padding: 0 4px;
          transition: opacity 0.2s;
        }

        .delete-btn:hover {
          opacity: 1;
          color: var(--danger);
        }

        .input-area {
          padding: 20px;
          display: flex;
          gap: 12px;
          background: rgba(30, 41, 59, 0.8);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: var(--accent-primary);
        }

        .send-btn {
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0 24px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .send-btn:hover {
          background: var(--accent-hover);
        }
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
