import fs from 'fs';
import path from 'path';
import Joi from 'joi';

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

export const addProduct = (newProduct, req, res) => {
    // Asegurarse de que status e id estén definidos
    newProduct.status = newProduct.status ?? true; // Asume true si no está definido
    newProduct.id = newProduct.id ?? Date.now().toString(); // Genera un ID si no está definido

    // Definir el esquema de validación
    const productSchema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(10).required(),
        code: Joi.string().alphanum().required(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().min(0).required(),
        category: Joi.string().required(),
        thumbnails: Joi.array().items(Joi.string().uri({ allowRelative: true })).required(),
        status: Joi.boolean().required(),
        id: Joi.string().required()
    });

    // Validar el nuevo producto contra el esquema
    const { error } = productSchema.validate(newProduct);

    if (error) {
        return res.status(400).json({ message: `Error en la validación: ${error.details[0].message}` });
    }

    try {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        console.log('Nuevo producto:', newProduct);
        products.push(newProduct);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

        // Emitir evento WebSocket al agregar producto
        if (req.io) {
            req.io.emit('productAdded', newProduct);
            // console.log('Evento productAdded emitido:', newProduct);
        }

        res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.status(500).json({ message: 'Error al agregar el producto' });
    }
};

export const updateProduct = (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;

    // Definir el esquema de validación
    const productSchema = Joi.object({
        title: Joi.string().min(3),
        description: Joi.string().min(10),
        code: Joi.string().alphanum(),
        price: Joi.number().positive(),
        stock: Joi.number().integer().min(0),
        category: Joi.string(),
        thumbnails: Joi.array().items(Joi.string().uri({ allowRelative: true })),
        status: Joi.boolean(),
        id: Joi.string() // No es obligatorio en la actualización, pero se valida si se incluye
    });

    // Validar los datos actualizados contra el esquema
    const { error } = productSchema.validate(updatedData);

    if (error) {
        return res.status(400).json({ message: `Error en la validación: ${error.details[0].message}` });
    }

    try {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const productIndex = products.findIndex(p => p.id === pid);

        if (productIndex !== -1) {
            const existingProduct = products[productIndex];

            // Mantener status e id originales si no se proporcionan
            const updatedProduct = {
                ...existingProduct,
                ...updatedData,
                status: updatedData.status ?? existingProduct.status,
                id: pid // Mantener el ID original
            };

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
