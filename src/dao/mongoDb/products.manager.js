import productModel from '../models/products.model.js';

class ProductDAO {
    constructor() {
        this.model = productModel;
    }

    async getProducts(limit, page, filter, sort) {
        try {
            return await this.model.paginate({ category: filter }, { lean: true, limit, page, filter, sort });
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async getProductById(productId) {
        try {
            return await this.model.findOne({ _id: productId });
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async addProduct(product) {
        try {
            const requiredFields = ['title', 'description', 'price', 'status', 'category', 'thumbnails', 'code', 'stock'];
            for (let field of requiredFields) {
                if (!product[field]) {
                    console.log(`Falta el campo ${field}`);
                    return field;
                }
            }

            const find = this.products.findOne({ code: product.code });
            if (find !== undefined) {
                console.log("El campo CODE se encuentra repetido");
                return;
            }
            return await this.model.create(product);
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateProduct(productId, update) {
        try {
            return await this.model.updateOne({ _id: productId }, update);
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteProduct(productId) {
        try {
            return await this.model.deleteOne({ _id: productId })
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }
}

const productDAO = new ProductDAO();
export default productDAO;