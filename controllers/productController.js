import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

if (!fs.existsSync(productsFilePath)) {
    console.log('El archivo no existe, se va a crear.');
    fs.writeFileSync(productsFilePath, JSON.stringify([], null, 2));
    console.log(`Archivo creado: ${productsFilePath}`);
}

export const getAllProducts = (req, res) => {
    try {
        const { limit } = req.query;
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

        if (limit) {
            const limitedProducts = products.slice(0, Number(limit));
            return res.render('home', { products: limitedProducts });
        }

        res.render('home', { products });
    } catch (error) {
        console.error('Error al leer los productos:', error);
        res.status(500).json({ message: 'Error al leer los productos' });
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
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al leer el producto:', error);
        res.status(500).json({ message: 'Error al leer el producto' });
    }
};

export const addProduct = (req, res) => {
    try {
        const newProduct = req.body;
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        newProduct.id = Date.now().toString();
        products.push(newProduct);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

        // Emitir evento WebSocket al agregar producto
        req.io.emit('productAdded', newProduct);

        res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ message: 'Error al agregar el producto' });
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
            res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

export const deleteProduct = (req, res) => {
    try {
        const { pid } = req.params;
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const newProducts = products.filter(p => p.id !== pid);

        if (newProducts.length !== products.length) {
            fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, 2));

            // Emitir evento WebSocket al eliminar producto
            req.io.emit('productRemoved', pid);

            res.status(200).json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};
