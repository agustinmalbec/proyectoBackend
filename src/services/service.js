import UserService from "./dao/mongoDb/users.service.js";
import CartService from "./dao/mongoDb/carts.service.js";
import ProductService from "./dao/mongoDb/products.service.js";
import TicketService from "./dao/mongoDb/tickets.service.js";
import MessagesService from "./dao/mongoDb/messages.service.js";

import UserRepository from "./repository/users.repository.js";
import CartRepository from "./repository/carts.repository.js";
import ProductRepository from "./repository/products.repository.js";
import TicketRepository from "./repository/tickets.repository.js";
import MessageRepository from "./repository/messages.repository.js";

const userDAO = new UserService();
const cartDAO = new CartService();
const productDAO = new ProductService();
const ticketDAO = new TicketService();
const messageDAO = new MessagesService();

export const userService = new UserRepository(userDAO);
export const cartService = new CartRepository(cartDAO);
export const productService = new ProductRepository(productDAO);
export const ticketService = new TicketRepository(ticketDAO);
export const messageService = new MessageRepository(messageDAO);