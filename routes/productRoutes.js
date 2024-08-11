import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import upload from '../config/uploadConfig.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:pid', getProductById);
// console.log('productRoutes.js se ha cargado correctamente');
router.post('/', upload.array('thumbnails', 5), (req, res) => {
    try {
        console.log('Inicio del POST / en /api/products');

        const thumbnails = req.files.map(file => `/images/${file.filename}`);
        console.log('Archivos subidos:', thumbnails);

        const newProduct = {
            ...req.body,
            // status: req.body.status !== undefined ? req.body.status : true,
            thumbnails,
            // id: Date.now().toString()
        };

        console.log('Nuevo producto antes de agregar (verificación):', newProduct);
        addProduct(newProduct, req, res);
    } catch (error) {
        console.error('Error en el POST /:', error.message);
        res.status(500).json({ message: 'Error en el procesamiento del producto' });
    }
});
router.put('/:pid', updateProduct);
router.delete('/:pid', (req, res) => {
    deleteProduct(req, res);
});

export default router;
