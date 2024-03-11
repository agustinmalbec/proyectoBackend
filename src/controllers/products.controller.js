import { productService } from "../services/service.js";
import CustomError from '../errors/customError.js';
import { createProductErrorInfo } from '../errors/customMessage.js'
import errorCodes from "../errors/errorCodes.js";

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
        //try {
        const requiredFields = ['title', 'description', 'price', 'category', 'code', 'stock'];
        for (let field of requiredFields) {
            if (!product[field]) {
                CustomError.createError({
                    name: "Product Create Error",
                    cause: createProductErrorInfo({ product }),
                    message: "Error tratando de crear un producto",
                    code: errorCodes.INVALID_TYPES_ERROR
                })
            }
        }
        const find = await this.controller.getProductByCode({ code: product.code });
        if (find !== null) {
            throw new Error("El campo CODE se encuentra repetido");
        }
        return await this.controller.addProduct(product);
        /* } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        } */
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