import { useEffect, useState, useRef } from 'react';
import { ChatInterface, type Message } from './ChatInterface';
import './index.css';

const WS_URL = 'wss://9yfysp-8080.csb.app/';
const API_URL = 'https://9yfysp-8080.csb.app/';
const OTHER_API = 'https://xmrmmn-8080.csb.app/'

function App() {
  const getOrCreateUserId = () => {
    const storedId = localStorage.getItem('userId');

    if (storedId) return storedId;

    const newId = crypto.randomUUID();
    localStorage.setItem('userId', newId);
    return newId;
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userId] = useState(getOrCreateUserId);
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

        switch (data.type) {
          case 'INIT_MESSAGES':
            setMessages(data.payload);
            break;

          case 'NEW_MESSAGE':
            setMessages(prev => [...prev, data.payload]);
            break;

          case 'DELETE_MESSAGE':
            setMessages(prev =>
                prev.filter(m => m.messageId !== data.payload)
            );
            break;

          default:
            console.warn('Unknown WS message type:', data);
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

  const getUsers = async () => {
    try {
      const response = await fetch(`${OTHER_API}users`, {
        method: 'GET',
        // headers: {
        //   'content-type': 'application/json',
        //   "Access-Control-Allow-Origin": "*",
        //   // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        //   // "Access-Control-Allow-Headers": "Content-Type, Authorization",
        //   // "Access-Control-Allow-Credentials": "true",
        // }
      });

      if (!response?.ok) {
        console.log('Failed');
      }
    } catch (error) {
      console.error('Error', error);
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
