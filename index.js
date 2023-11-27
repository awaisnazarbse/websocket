// Import required modules
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const  { Telegraf} = require('telegraf');

// Create an Express app
const app = express();

// Create an HTTP server and integrate it with the Express app
const server = http.createServer(app);

const bot = new Telegraf('6297816480:AAHRovrvmvSfmq-18CoMVBcyP12eF6pYDdo');

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

bot.use(async (ctx, next) => {
  const user = ctx?.message;
  console.log({user})
  console.time(`Processing update ${ctx.update.update_id}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      if(user !== undefined) {
      client.send(JSON.stringify(user));
    }
    }
  });
  await next() // runs next middleware
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

// bot.on(message('text'), (ctx) => ctx.reply('Hello World'));
bot.launch();

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});