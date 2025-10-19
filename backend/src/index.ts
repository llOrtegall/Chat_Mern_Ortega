const server = Bun.serve({
  port: 4000, 
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) return undefined;
 
    return new Response("Hello world!");
  },
  websocket: {
    open: (ws) => {
      console.log('new user');
    },
    message: (ws, msg) => {
      console.log(msg);
      ws.send(msg)
    },
    close: (ws) => {
      console.log("Client disconnected");
    },

  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
