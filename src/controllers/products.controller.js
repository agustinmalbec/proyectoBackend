import { productService } from "../services/service.js";

class ProductController {
    constructor() {
        this.controller = productService;
    }

    async getProducts(limit, page, filter, sort) {
        try {
            return await this.controller.getProducts(limit, page, filter, sort);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getProductById(productId) {
        try {
            return await this.controller.getProductById(productId);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async addProduct(product) {
        try {
            const requiredFields = ['title', 'description', 'price', 'category', 'code', 'stock'];
            for (let field of requiredFields) {
                if (!product[field]) {
                    throw new Error(`Falta el campo ${field}`);
                }
            }
            const find = await this.controller.getProductByCode({ code: product.code });
            if (find !== null) {
                throw new Error("El campo CODE se encuentra repetido");
            }
            return await this.controller.addProduct(product);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateProduct(productId, update) {
        try {
            return await this.controller.updateProduct(productId, update);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteProduct(productId) {
        try {
            return await this.controller.deleteProduct(productId)
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }
}

const productController = new ProductController();
export default productController;