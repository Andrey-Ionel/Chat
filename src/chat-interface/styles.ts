import styled, { css } from 'styled-components';

export const ChatContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const ChatHeader = styled.header`
  padding: 20px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

export const StatusBadge = styled.div<{ $isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  padding: 4px 12px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  color: ${({ $isConnected }) => ($isConnected ? '#4ade80' : '#ef4444')};
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmptyState = styled.div`
  text-align: center;
  color: var(--text-secondary);
  margin-top: 40px;
`;

interface MessageWrapperProps {
    $isSent: boolean;
}

export const MessageWrapper = styled.div<MessageWrapperProps>`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  ${props => (props as MessageWrapperProps).$isSent ? css`
    align-self: flex-end;
    align-items: flex-end;
  ` : css`
    align-self: flex-start;
    align-items: flex-start;
  `}
`;

export const MessageBubble = styled.div<{ $isSent?: boolean }>`
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
  word-break: break-word;
  background: ${({ $isSent }) => $isSent ? 'var(--msg-sent)' : 'var(--msg-received)'};
  
  ${({ $isSent }) => $isSent ? css`
    border-bottom-right-radius: 4px;
  ` : css`
    border-bottom-left-radius: 4px;
  `}
`;

export const MessageContent = styled.div``;

export const MessageMeta = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 0.7rem;
  opacity: 0.7;
`;

export const Timestamp = styled.span``;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  opacity: 0.5;
  padding: 0 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    color: var(--danger);
  }
`;

export const InputArea = styled.form`
  padding: 20px;
  display: flex;
  gap: 12px;
  background: rgba(30, 41, 59, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ChatInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--accent-primary);
  }
`;

export const SendButton = styled.button`
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0 24px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--accent-hover);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
