import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { setupSocket } from './socketHandler.js';
import { config } from './config.js';

const server = createServer(app);
const io = new Server(server);

// Configurar eventos de WebSocket
setupSocket(io);

// Escuchar en el puerto especificado
server.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
});
