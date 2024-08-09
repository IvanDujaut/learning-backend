import express from 'express';
import bodyParser from 'body-parser';
import { create } from 'express-handlebars';
import path from 'path';
import { __dirname } from './utils.js';
import routes from './routes/index.js';
import { config } from './config.js';

const app = express();

// Configurar Handlebars como motor de plantillas
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, config.layoutsDir),
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, config.viewsDir));

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, config.publicDir)));

// Configurar las rutas
app.use('/', routes);

export default app;
