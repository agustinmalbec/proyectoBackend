import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            try {
                let carts = fs.readFileSync(path, 'utf-8');
                this.carts = JSON.parse(carts);
            } catch (error) {
                this.carts = [];
            }
        } else {
            this.carts = [];
        }
    }

    async saveFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t')
            );
            return true;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
            return false;
        }
    }

    async addCart(cart) {
        try {
            cart.products = [];
            cart.id = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
            this.carts.push(cart);

            const response = await this.saveFile(this.carts);
            if (response) {
                console.log("Carrito agregado correctamente");
            } else {
                console.log("Hubo un error al agregar un carrito");
            }

            return cart;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = this.carts.find((finded) => finded.id === Number(cartId));
            if (cart) {
                return cart;
            } else {
                console.log(`Not found ID ${cartId}`);
                return;
            }
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const pid = Number(productId);
            const cart = this.carts.find((finded) => finded.id === Number(cartId));
            const index = cart.products.findIndex((finded) => finded.product === pid);
            if (index === -1) {
                cart.products.push({ product: pid, quantity: 1 });
                console.log('Se agrego al carrito');
            } else {
                cart.products[index].quantity++;
                console.log('Se incremento la cantidad');
            }
            console.log(this.carts)
            await this.saveFile(this.carts);

            return cart;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

}

const cartManager = new CartManager('./data/carts.json');
export default cartManager;