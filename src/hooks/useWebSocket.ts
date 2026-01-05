import { useRef, useState, useCallback } from "react";
import type {Message, WSMessage} from "../types/wsTypes";

export function useWebSocket(url: string, room: string, userId: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);

      ws.send(JSON.stringify({
        type: "JOIN_ROOM",
        payload: { roomId: room },
      }));
    };

    ws.onmessage = (event) => {
      const data: WSMessage = JSON.parse(event.data);
      console.log("'zxc', 'data'", data);

      switch (data.type) {
        case "INIT_MESSAGES":
          setMessages(data.payload);
          break;

        case "NEW_MESSAGE":
          setMessages((prev) => [...prev, data.payload]);
          break;

        case "DELETE_MESSAGE":
          setMessages((prev) =>
            prev.filter((m) => m?.messageId !== data.payload)
          );
          break;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) return;

      wsRef.current?.send(JSON.stringify({
        senderId: userId,
        messageId: Date.now().toString(),
        message: text,
        date: new Date().toISOString(),
      }));
    },
    []
  );

  return {
    messages,
    isConnected,
    connectWebSocket,
    sendMessage,
    ws: wsRef.current
  };
}
