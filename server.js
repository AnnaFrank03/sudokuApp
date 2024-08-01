const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Statt 'public', benutze das aktuelle Verzeichnis ('__dirname')
app.use(express.static(path.join(__dirname)));

let initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

let currentBoard = JSON.parse(JSON.stringify(initialBoard));

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('initialBoard', currentBoard);

    socket.on('cellUpdate', ({ row, col, value }) => {
        console.log(`Cell update: ${row}, ${col}, ${value}`);
        currentBoard[row][col] = parseInt(value, 10) || 0;
        io.emit('updateBoard', currentBoard);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(7000, () => {
    console.log('Listening on port 7000');
});