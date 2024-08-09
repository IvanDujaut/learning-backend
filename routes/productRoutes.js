import { Router } from 'express';
import {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:pid', getProductById);
router.post('/', (req, res) => {
    addProduct(req, res);
});
router.put('/:pid', updateProduct);
router.delete('/:pid', (req, res) => {
    deleteProduct(req, res);
});

export default router;
