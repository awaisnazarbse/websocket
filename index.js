// Import required modules
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Create an Express app
const app = express();

// Create an HTTP server and integrate it with the Express app
const server = http.createServer(app);

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Set up a route in Express to serve your HTML page or any other assets
app.get('/', (req, res) => {
  res.send("server running");
});

// Set up the WebSocket server event handlers
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle messages from clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});