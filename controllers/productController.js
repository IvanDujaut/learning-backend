import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'data', 'products.json');
console.log(`Ruta del archivo de productos: ${productsFilePath}`);
console.log(`Directorio actual de trabajo: ${process.cwd()}`);

if (!fs.existsSync(productsFilePath)) {
    console.log('El archivo no existe, se va a crear.');
    fs.writeFileSync(productsFilePath, JSON.stringify([], null, 2));
    console.log(`Archivo creado: ${productsFilePath}`);
}

export const getAllProducts = (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        res.json(products);
    } catch (error) {
        res.status(500).send('Error al leer los productos');
    }
};

export const getProductById = (req, res) => {
    try {
        const { pid } = req.params;
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const product = products.find(p => p.id === pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al leer el producto');
    }
};

export const addProduct = (req, res) => {
    try {
        const newProduct = req.body;
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        newProduct.id = Date.now().toString();
        products.push(newProduct);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).send('Error al agregar el producto');
    }
};

export const updateProduct = (req, res) => {
    try {
        const { pid } = req.params;
        const updatedData = req.body;
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const productIndex = products.findIndex(p => p.id === pid);

        if (productIndex !== -1) {
            const updatedProduct = { ...products[productIndex], ...updatedData, id: pid };
            products[productIndex] = updatedProduct;
            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
            res.json(updatedProduct);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al actualizar el producto');
    }
};

export const deleteProduct = (req, res) => {
    try {
        const { pid } = req.params;
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const newProducts = products.filter(p => p.id !== pid);

        if (newProducts.length !== products.length) {
            fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, 2));
            res.status(204).send();
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al eliminar el producto');
    }
};
