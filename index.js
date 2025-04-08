const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

let players = {};

io.on('connection', socket => {
  console.log('New player:', socket.id);
  players[socket.id] = { x: 100, y: 100, id: socket.id };

  io.emit('playersUpdate', players);

  socket.on('move', data => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      io.emit('playersUpdate', players);
    }
  });

  socket.on('chat', msg => {
    io.emit('chatMessage', { id: socket.id, ...msg });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('playersUpdate', players);
  });
});

server.listen(3001, () => console.log('Server running on http://localhost:3001'));