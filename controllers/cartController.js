import fs from 'fs';
import path from 'path';

const cartFilePath = path.join(__dirname, '../data/cart.json');

export const createCart = (req, res) => {
    const newCart = { id: Date.now().toString(), products: [] };
    const carts = JSON.parse(fs.readFileSync(cartFilePath));
    carts.push(newCart);
    fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
};

export const getCartById = (req, res) => {
    const { cid } = req.params;
    const carts = JSON.parse(fs.readFileSync(cartFilePath));
    const cart = carts.find(c => c.id === cid);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
};

export const addProductToCart = (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const carts = JSON.parse(fs.readFileSync(cartFilePath));
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json')));

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
};
