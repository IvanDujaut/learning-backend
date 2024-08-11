import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { setupSocket } from './socketHandler.js';
import { config } from './config/config.js';

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

// Configurar eventos de WebSocket
setupSocket(io);

// Añadir io a la solicitud
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Escuchar en el puerto especificado
server.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
});
