class ProductManager {

    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const product = this.products.find((finded) => finded.id === productId);
        if (product) {
            return product;
        } else {
            return console.log(`Not found ID ${productId}`);
        }
    }

    addProduct(product) {
        if (!product.title) {
            return console.log("Falta el campo TITLE");
        }
        if (!product.description) {
            return console.log("Falta el campo DESCRIPTION");
        }
        if (!product.price) {
            return console.log("Falta el campo PRICE");
        }
        if (!product.thumbnail) {
            return console.log("Falta el campo THUMBNAIL");
        }
        if (!product.code) {
            return console.log("Falta el campo CODE");
        }
        if (!product.stock) {
            return console.log("Falta el campo STOCK");
        }

        const find = this.products.find((finded) => finded.code === product.code);
        if (find === undefined) {
            if (this.products.length === 0) {
                product.id = 1;
            } else {
                product.id = this.products[this.products.length - 1].id + 1;
            }
            return this.products.push(product);
        } else {
            return console.log("El campo CODE se encuentra repetido");
        }
    }
}

const producto1 = { title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 };

const manager = new ProductManager();
console.log(manager.getProducts());
manager.addProduct(producto1);
manager.addProduct(producto1);
manager.getProductById(2);
console.log(manager.getProducts());