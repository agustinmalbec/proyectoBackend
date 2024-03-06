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

    async getProducts() {
        try {
            return this.products;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async getProductById(productId) {
        try {
            const product = this.products.find((finded) => finded.id === Number(productId));
            if (product) {
                return product;
            } else {
                console.log(`Not found ID ${productId}`);
                return;
            }
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async addProduct(product) {
        try {
            product.status = true;
            if (!product.thumbnails) {
                product.thumbnails = [];
            }

            const requiredFields = ['title', 'description', 'price', 'status', 'category', 'thumbnails', 'code', 'stock'];
            for (let field of requiredFields) {
                if (!product[field]) {
                    console.log(`Falta el campo ${field}`);
                    return field;
                }
            }

            const find = this.products.find((finded) => finded.code === product.code);
            if (find !== undefined) {
                console.log("El campo CODE se encuentra repetido");
                return;
            }

            product.id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;

            this.products.push(product);

            const response = await this.saveFile(this.products);
            if (response) {
                console.log("Producto agregado correctamente");
            } else {
                console.log("Hubo un error al agregar un producto");
            }

            return product;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateProduct(productId, update) {
        try {
            const product = this.products.find((prod) => prod.id == productId);
            const index = this.products.findIndex(prod => prod.id == productId);
            if (index === -1) {
                console.log('No se encontro el producto');
                return;
            }
            const productUpdated = { ...product, ...update };
            this.products[index] = productUpdated;
            await this.saveFile(this.products);
            console.log("Actualizado correctamente");
            return productUpdated;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteProduct(productId) {
        try {
            console.log(productId);
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

const productService = new ProductManager('./data/products.json');
export default productService;

const producto1 = { title: 'producto prueba', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc1', stock: 25 };
const producto2 = { title: 'producto 2', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc2', stock: 25 };
const producto3 = { title: 'producto 2', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc3', stock: 25 };
const producto4 = { title: 'producto 4', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc4', stock: 25 };
const producto5 = { title: 'producto 5', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc5', stock: 25 };
const producto6 = { title: 'producto 6', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc6', stock: 25 };
const producto7 = { title: 'producto 7', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc7', stock: 25 };
const producto8 = { title: 'producto 8', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc8', stock: 25 };
const producto9 = { title: 'producto 9', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc9', stock: 25 };
const producto10 = { title: 'producto 10', description: 'Este es un producto prueba', price: 200, thumbnail: 'Sin imagen', code: 'abc10', stock: 25 };


async function test() {
    console.log(manager.getProducts());
    await productManager.addProduct(producto1);
    await productManager.addProduct(producto2);
    await productManager.addProduct(producto3);
    await productManager.addProduct(producto4);
    await productManager.addProduct(producto5);
    await productManager.addProduct(producto6);
    await productManager.addProduct(producto7);
    await productManager.addProduct(producto8);
    await productManager.addProduct(producto9);
    await productManager.addProduct(producto10);
    await productManager.getProductById(2);
    console.log(productManager.getProducts());
}

//test(); 