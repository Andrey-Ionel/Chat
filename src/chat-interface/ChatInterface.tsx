import React, { useState, useRef, useEffect } from 'react';
import type { ChatInterfaceProps } from './types.ts';
import {
  ChatContainer,
  ChatHeader,
  HeaderContent,
  StatusBadge,
  StatusDot,
  MessagesArea,
  EmptyState,
  MessageWrapper,
  MessageBubble,
  MessageContent,
  MessageMeta,
  Timestamp,
  DeleteButton,
  InputArea,
  ChatInput,
  SendButton
} from './styles.ts';

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
    <ChatContainer>
      <ChatHeader>
        <HeaderContent>
          <h1>Messenger</h1>
          <StatusBadge $isConnected={isConnected}>
            <StatusDot />
            {isConnected ? 'Connected' : 'Disconnected'}
          </StatusBadge>
        </HeaderContent>
      </ChatHeader>

      <MessagesArea>
        {messages?.length === 0 ? (
          <EmptyState>No messages yet. Say hello!</EmptyState>
        ) : (
          !!messages?.length && messages?.map((msg) => {
            const isMyMessage = msg.senderId === currentUserId;
            return (
              <MessageWrapper key={msg.messageId} $isSent={isMyMessage}>
                <MessageBubble $isSent={isMyMessage} className="glass">
                  <MessageContent>{msg.message}</MessageContent>
                  <MessageMeta>
                    <Timestamp>{formatDate(msg.date)}</Timestamp>
                    {isMyMessage && (
                      <DeleteButton
                        onClick={() => onDeleteMessage(msg.messageId)}
                        title="Delete message"
                      >
                        ×
                      </DeleteButton>
                    )}
                  </MessageMeta>
                </MessageBubble>
              </MessageWrapper>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesArea>

      <InputArea onSubmit={handleSubmit}>
        <ChatInput
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
          maxLength={500}
        />
        <SendButton type="submit" disabled={!isConnected || !inputText.trim()}>
          Send
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
};
