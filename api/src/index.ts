import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3010 });

wss.on("connection", (ws) => {

    ws.on("message", (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.send("Hello from server");

    [...wss.clients].forEach(c => console.log(c.readyState));

});