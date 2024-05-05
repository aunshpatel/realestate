// websocket-server.js

// Initialize WebSocket server
import { Server } from 'ws';
const wss = new Server({ port: 8080 });

// Handle WebSocket connections
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Handle incoming messages from clients
  ws.on('message', function incoming(message) {
    console.log('Received message:', message);

    // Parse and handle different message types
    const data = JSON.parse(message);
    switch (data.type) {
      case 'update_profile':
        // Handle profile update
        break;
      default:
        // Handle other message types
        break;
    }
  });

  // Handle WebSocket disconnections
  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});
