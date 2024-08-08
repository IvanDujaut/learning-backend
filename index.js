import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();
const PORT = 8080; // o el puerto que estés usando

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Configurar las rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

