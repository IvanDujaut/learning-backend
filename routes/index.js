import fs from 'fs';
import path from 'path';

import { Router } from 'express';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';
import { getAllProducts } from '../controllers/productController.js';

const router = Router();

router.use('/api/products', productRoutes);
router.use('/api/carts', cartRoutes);

// Ruta principal para cargar y renderizar productos desde products.json
router.get('/', (req, res) => {
    console.log('Ruta principal alcanzada');
    getAllProducts(req, res);
});

router.get('/realtimeproducts', (req, res) => {
    try {
        const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        res.status(500).send('Error al cargar los productos');
    }
});

export default router;
