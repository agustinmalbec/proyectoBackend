import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import productController from '../controllers/products.controller.js';
import messagesController from '../controllers/messages.controller.js';

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);
let us;

io.on('connection', async (socket) => {

    const products = await productController.getProducts(999999, 1, null, 1);
    socket.emit('products', products.docs);
    socket.on('update', async () => {
        const products = await productController.getProducts(999999, 1, null, 1);
        socket.emit('products', products.docs);
    });

    socket.emit('messages', await messagesController.getAllMessages());
    socket.on('newUser', async (user) => {
        us = await messagesController.addUser(user);
    });
    socket.on('sendMessage', async (message) => {
        await messagesController.addMessage(us, message);
        socket.emit('messages', await messagesController.getAllMessages());
    });
});