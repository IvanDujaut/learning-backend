# Learning Backend

Este proyecto es una API RESTful construida con Node.js y Express para gestionar productos y carritos de compra, ahora extendida con WebSockets para actualizaciones en tiempo real. Está diseñada para servir como un ejemplo educativo sobre cómo construir y manejar rutas, controladores, manejar archivos en un entorno backend, y gestionar actualizaciones en tiempo real.

## Características

- Gestión de productos: Crear, leer, actualizar y eliminar productos.
- Gestión de carritos: Crear carritos y agregar productos a los carritos.
- Persistencia de datos en archivos JSON.
- Integración de WebSockets para actualizaciones en tiempo real de la lista de productos.
- Uso de Handlebars como motor de plantillas para renderizar vistas dinámicas.
- Modularización del código con separación de responsabilidades en controladores, rutas y manejo de WebSockets.

## Requisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local:

1. **Clona este repositorio**:

    ```bash
    git clone https://github.com/tu-usuario/learning-backend.git
    cd learning-backend
    ```

2. **Instala las dependencias**:

    ```bash
    npm install
    ```

3. **Configuración del entorno**:

    Asegúrate de que los archivos de datos `products.json` y `cart.json` existen en el directorio `data`. Si no existen, créalos manualmente:

    ```bash
    mkdir -p data
    echo "[]" > data/products.json
    echo "[]" > data/cart.json
    ```

4. **Ejecuta el servidor en modo desarrollo**:

    ```bash
    npm run dev
    ```

    El servidor debería estar ejecutándose en `http://localhost:8080`.

## Endpoints

### Productos

- **Obtener todos los productos**

    ```http
    GET /api/products/
    ```

    **Parámetros de consulta**:
    
    - `limit` (opcional): Un número para limitar la cantidad de productos devueltos.

    **Ejemplo de uso**:
    
    ```http
    GET /api/products?limit=2
    ```

- **Obtener un producto por ID**

    ```http
    GET /api/products/:pid
    ```

- **Crear un nuevo producto**

    ```http
    POST /api/products/
    ```

    **Body**:

    ```json
    {
      "title": "Producto de Prueba",
      "description": "Descripción del producto de prueba",
      "code": "P12345",
      "price": 100,
      "status": true,
      "stock": 50,
      "category": "Categoría de Prueba",
      "thumbnails": ["ruta1.jpg", "ruta2.jpg"]
    }
    ```

- **Actualizar un producto**

    ```http
    PUT /api/products/:pid
    ```

    **Body**:

    ```json
    {
      "title": "Producto Actualizado",
      "description": "Descripción actualizada del producto",
      "price": 150,
      "stock": 30
    }
    ```

- **Eliminar un producto**

    ```http
    DELETE /api/products/:pid
    ```

### Carritos

- **Crear un nuevo carrito**

    ```http
    POST /api/carts/
    ```

- **Obtener un carrito por ID**

    ```http
    GET /api/carts/:cid
    ```

- **Agregar un producto a un carrito**

    ```http
    POST /api/carts/:cid/product/:pid
    ```

    **Body**:

    ```json
    {
      "quantity": 2
    }
    ```

### Actualizaciones en Tiempo Real

- **Ver productos en tiempo real**

    ```http
    GET /realtimeproducts
    ```

    Esta vista mostrará la lista de productos con actualizaciones en tiempo real utilizando WebSockets.

## Pruebas

Puedes usar herramientas como Postman para probar los endpoints mencionados anteriormente. Asegúrate de que el servidor esté ejecutándose y utiliza las URLs y métodos HTTP adecuados para cada operación.

Para probar las actualizaciones en tiempo real, abre la URL `http://localhost:8080/realtimeproducts` en tu navegador. Cuando agregues o elimines productos utilizando Postman o cualquier otra herramienta, la lista de productos en esta página se actualizará automáticamente.

## Estructura del Proyecto

```plaintext
learning-backend/
├── controllers/
│   ├── cartController.js
│   └── productController.js
├── data/
│   ├── cart.json
│   └── products.json
├── routes/
│   ├── cartRoutes.js
│   ├── index.js
│   └── productRoutes.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── home.handlebars
│   └── realTimeProducts.handlebars
├── .gitignore
├── app.js
├── config.js
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── server.js
├── socketHandler.js
└── utils.js

