import WebSocket, { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import url from "url";

// Interface para extender WebSocket con datos de usuario
interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  userEmail?: string;
  userName?: string;
  isAlive?: boolean;
}

// Mapa para almacenar usuarios conectados
const connectedUsers = new Map<string, ExtendedWebSocket>();

const wss = new WebSocketServer({
  port: 3010,
  verifyClient: (info: { origin: string; secure: boolean; req: IncomingMessage }) => {
    // Aquí puedes agregar validaciones adicionales si es necesario
    return true;
  }
});

wss.on("connection", (ws: ExtendedWebSocket, request: IncomingMessage) => {
  // Extraer parámetros de query de la URL de conexión
  const query = url.parse(request.url || '', true).query;
  const userEmail = query.email as string;
  const userName = query.name as string;
  const userId = query.userId as string;

  // Validar que se recibieron los datos del usuario
  if (!userEmail || !userName) {
    console.log("Connection rejected: Missing user data");
    ws.close(1008, "Missing user authentication data");
    return;
  }

  // Asignar datos del usuario al WebSocket
  ws.userId = userId || userEmail; // Usar userId o email como identificador
  ws.userEmail = userEmail;
  ws.userName = userName;
  ws.isAlive = true;

  // Almacenar usuario conectado
  connectedUsers.set(ws.userId, ws);

  // Enviar mensaje de bienvenida personalizado
  ws.send(JSON.stringify({
    type: "welcome",
    message: `Welcome ${userName}!`,
    connectedUsers: Array.from(connectedUsers.values()).map(client => ({
      name: client.userName,
      email: client.userEmail
    }))
  }));

  // Notificar a otros usuarios sobre la nueva conexión
  broadcastToOthers(ws, {
    type: "user_joined",
    user: { name: userName, email: userEmail },
    message: `${userName} joined the chat`
  });

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`Message from ${userName}: ${data.content || message}`);

      // Retransmitir mensaje a todos los clientes conectados
      broadcastMessage({
        type: "chat_message",
        user: { name: userName, email: userEmail },
        content: data.content || message.toString(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    connectedUsers.delete(ws.userId!);

    // Notificar a otros usuarios sobre la desconexión
    broadcastToOthers(ws, {
      type: "user_left",
      user: { name: userName, email: userEmail },
      message: `${userName} left the chat`
    });
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error for ${userName}:`, error);
    connectedUsers.delete(ws.userId!);
  });

  // Heartbeat para detectar conexiones muertas
  ws.on("pong", () => {
    ws.isAlive = true;
  });
});

// Función para enviar mensaje a todos los clientes
function broadcastMessage(data: any) {
  const message = JSON.stringify(data);
  connectedUsers.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Función para enviar mensaje a todos excepto al remitente
function broadcastToOthers(sender: ExtendedWebSocket, data: any) {
  const message = JSON.stringify(data);
  connectedUsers.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Heartbeat para limpiar conexiones muertas
const interval = setInterval(() => {
  connectedUsers.forEach((client, userId) => {
    if (!client.isAlive) {
      console.log(`Removing dead connection: ${userId}`);
      connectedUsers.delete(userId);
      return client.terminate();
    }
    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(interval);
});

console.log("WebSocket server running on port 3010");