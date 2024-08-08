import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(__dirname, '../data/products.json');

export const getAllProducts = (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath));
    res.json(products);
};

export const getProductById = (req, res) => {
    const { pid } = req.params;
    const products = JSON.parse(fs.readFileSync(productsFilePath));
    const product = products.find(p => p.id === pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
};

export const addProduct = (req, res) => {
    const newProduct = req.body;
    const products = JSON.parse(fs.readFileSync(productsFilePath));
    newProduct.id = Date.now().toString();
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
};

export const updateProduct = (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;
    const products = JSON.parse(fs.readFileSync(productsFilePath));
    const productIndex = products.findIndex(p => p.id === pid);

    if (productIndex !== -1) {
        const updatedProduct = { ...products[productIndex], ...updatedData, id: pid };
        products[productIndex] = updatedProduct;
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.json(updatedProduct);
    } else {
        res.status(404).send('Producto no encontrado');
    }
};

export const deleteProduct = (req, res) => {
    const { pid } = req.params;
    const products = JSON.parse(fs.readFileSync(productsFilePath));
    const newProducts = products.filter(p => p.id !== pid);

    if (newProducts.length !== products.length) {
        fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, 2));
        res.status(204).send();
    } else {
        res.status(404).send('Producto no encontrado');
    }
};
