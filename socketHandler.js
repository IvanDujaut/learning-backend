import fs from 'fs';
import path from 'path';
import { __dirname } from './utils.js';
import { config } from './config/config.js';

const productsFilePath = path.join(__dirname, config.dataDir, 'products.json');

export const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });

        socket.on('productAdded', (newProduct) => {
            try {
                const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

                // Asegurarse de que el producto tiene las propiedades status e id
                newProduct.status = newProduct.status !== undefined ? newProduct.status : true;
                newProduct.id = newProduct.id || Date.now().toString();

                products.push(newProduct);
                fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

                io.emit('productUpdate', products); // Enviar a todos los clientes la actualización
                io.emit('productAdded', newProduct); // Confirmación del producto agregado
                // console.log('Producto agregado recibido desde el cliente:', newProduct);
            } catch (error) {
                console.error('Error al procesar el producto en el servidor:', error);
            }
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
