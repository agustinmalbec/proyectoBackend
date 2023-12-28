import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import productDAO from './dao/mongoDb/products.manager.js';
import messagesDAO from './dao/mongoDb/messages.manager.js';

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server);
let us;

io.on('connection', async (socket) => {
    console.log('Nuevo usuario conectado');

    socket.emit('products', await productDAO.getProducts());
    socket.on('addProduct', async (product) => {
        await productDAO.addProduct(product);
        socket.emit('products', await productDAO.getProducts());
    });
    socket.on('deleteProduct', async (data) => {
        await productDAO.deleteProduct(Number(data.id));
        socket.emit('products', await productDAO.getProducts());
    });

    socket.emit('messages', await messagesDAO.getAllMessages());
    socket.on('newUser', async (user) => {
        us = await messagesDAO.addUser(user);
    });
    socket.on('sendMessage', async (message) => {
        await messagesDAO.addMessage(us, message);
        socket.emit('messages', await messagesDAO.getAllMessages());
    });
});