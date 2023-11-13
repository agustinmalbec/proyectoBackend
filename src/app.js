import express from 'express';
import productManager from './manager/productManager.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Express');
});

app.get('/products', (req, res) => {
    try {
        const limit = req.query.limit;
        const products = productManager.getProducts();
        const limitedProducts = products.slice(0, limit);
        res.send(limitedProducts);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

app.get('/products/:pid', (req, res) => {
    try {
        const pid = req.params.pid;
        const product = productManager.getProductById(pid);
        if (!product) {
            return res.send(`No se encotro el producto con id ${pid}`);
        }
        res.send(product);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

app.listen(8080, () => console.log('Escuchando el puerto 8080'));