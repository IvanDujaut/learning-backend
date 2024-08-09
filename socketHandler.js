import fs from 'fs';
import path from 'path';
import { __dirname } from './utils.js';
import { config } from './config.js';

const productsFilePath = path.join(__dirname, config.dataDir, 'products.json');

export const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });

        socket.on('productAdded', (newProduct) => {
            const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
            products.push(newProduct);
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
            io.emit('productUpdate', products);
            io.emit('productAdded', newProduct);
        });

        socket.on('productRemoved', (productId) => {
            let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
            products = products.filter(product => product.id !== productId);
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
            io.emit('productUpdate', products);
            io.emit('productRemoved', productId);
        });
    });
};
