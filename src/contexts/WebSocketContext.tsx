import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (msg: any) => void;
  messages: any[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.warn("⚠️ No hay token, no se puede abrir WS");
      return;
    }
    const connect = () => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      const wsUrl = `${import.meta.env["VITE_WEB_SOCKET_SVC"]}/chat/websocket?token=${token}`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WS conectado");
        setIsConnected(true);

        // ping cada 60s
        pingIntervalRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "ping" }));
            console.debug("📡 ping enviado");
          }
        }, 60000);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Mensaje entrante:", data);

        if (data.type === "pong") return;
        setMessages((prev) => [...prev, data]);
      };

      socket.onclose = () => {
        console.warn("❌ WS cerrado, intentando reconectar...");
        setIsConnected(false);
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      socket.onerror = (err) => {
        console.error("🔥 Error WS:", err);
        setIsConnected(false);
      };
    };

    connect();

    return () => {
      console.log("🔌 Cerrando WS...");
      if (socketRef.current) socketRef.current.close();
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  const sendMessage = (msg: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("⚠️ No se puede enviar, WS desconectado");
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook para consumir el WS
export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket debe usarse dentro de <WebSocketProvider>");
  return ctx;
};
