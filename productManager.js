import { log } from 'console';
import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            try {
                let products = fs.readFileSync(path, 'utf-8');
                this.products = JSON.parse(products);
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
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

    getProducts() {
        try {
            return this.products;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    getProductById(productId) {
        try {
            const product = this.products.find((finded) => finded.id === productId);
            if (product) {
                return product;
            } else {
                return console.log(`Not found ID ${productId}`);
            }
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async addProduct(product) {
        try {
            const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
            for (let field of requiredFields) {
                if (!product[field]) {
                    return console.log(`Falta el campo ${field}`);
                }
            }

            const find = this.products.find((finded) => finded.code === product.code);
            if (find !== undefined) {
                return console.log("El campo CODE se encuentra repetido");
            }

            product.id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
            this.products.push(product);

            const response = await this.saveFile(this.products);
            if (response) {
                console.log("Usuario agregado correctamente");
            } else {
                console.log("Hubo un error al crear un usuario");
            }

            return product;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateProduct(productId, update) {
        try {
            const product = this.products.find((prod) => prod.id === productId);
            const index = this.products.findIndex(prod => prod.id === productId);
            if (index === -1) {
                return console.log('No se encontro el producto');
            }
            update.id = product.id;
            this.products[index] = update;
            await this.saveFile(this.products);
            return console.log("Actualizado correctamente");
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteProduct(productId) {
        try {
            const index = this.products.findIndex(prod => prod.id === productId);
            if (index === -1) {
                return console.log('No se encontro el producto');
            }
            this.products.splice(index, 1);
            await this.saveFile(this.products);
            return console.log("Eliminado correctamente");
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }
}

const producto1 = { title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc123', stock: 25 };

const manager = new ProductManager('./products.json');
/* console.log(manager.getProducts());
manager.addProduct(producto1);
manager.getProductById(2);
console.log(manager.getProducts()); */
manager.deleteProduct(1);
