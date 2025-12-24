import { useEffect, useState, useRef } from 'react';
import { ChatInterface, type Message } from './ChatInterface';
import './index.css';

const WS_URL = 'wss://9yfysp-8080.csb.app/';
const API_URL = 'https://9yfysp-8080.csb.app/';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userId] = useState(() => 'user-' + Math.random().toString(36).substr(2, 9));
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current?.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.log('Received non-array data:', data);
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  const handleSendMessage = (text: string) => {
    if (!wsRef.current || wsRef.current?.readyState !== WebSocket.OPEN) return;

    const payload = {
      senderId: userId,
      messageId: Date.now().toString(),
      message: text,
      date: new Date().toString(),
    };

    wsRef.current?.send(JSON.stringify(payload));
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      setMessages(prev => prev.filter(m => m.messageId !== id));

      const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      onDeleteMessage={handleDeleteMessage}
      isConnected={isConnected}
      currentUserId={userId}
    />
  );
}

export default App;
