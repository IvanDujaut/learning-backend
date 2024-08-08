import fs from 'fs';
import path from 'path';

const cartFilePath = path.join(process.cwd(), 'data', 'cart.json');
const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
console.log(`Ruta del archivo de carritos: ${cartFilePath}`);

if (!fs.existsSync(cartFilePath)) {
    console.log('El archivo de carritos no existe, se va a crear.');
    fs.writeFileSync(cartFilePath, JSON.stringify([], null, 2));
    console.log(`Archivo creado: ${cartFilePath}`);
}

export const createCart = (req, res) => {
    try {
        const newCart = { id: Date.now().toString(), products: [] };
        const carts = JSON.parse(fs.readFileSync(cartFilePath, 'utf-8'));
        carts.push(newCart);
        fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).send('Error al crear el carrito');
    }
};

export const getCartById = (req, res) => {
    try {
        const { cid } = req.params;
        const carts = JSON.parse(fs.readFileSync(cartFilePath, 'utf-8'));
        const cart = carts.find(c => c.id === cid);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        console.error('Error al leer el carrito:', error);
        res.status(500).send('Error al leer el carrito');
    }
};

export const addProductToCart = (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const carts = JSON.parse(fs.readFileSync(cartFilePath, 'utf-8'));
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

        const cart = carts.find(c => c.id === cid);
        const product = products.find(p => p.id === pid);

        if (cart && product) {
            const productInCart = cart.products.find(p => p.id === pid);
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ id: pid, quantity });
            }
            fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
            res.status(200).json(cart);
        } else {
            res.status(404).send('Carrito o producto no encontrado');
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send('Error al agregar producto al carrito');
    }
};
