import productModel from '../models/products.model.js';

class ProductDAO {
    constructor() {
        this.model = productModel;
    }

    async getProducts() {
        return await this.model.find().lean();
    }

    async getProductById(productId) {
        return await this.model.findOne({ _id: productId });
    }

    async addProduct(product) {
        return await this.model.create(product);
    }

    async updateProduct(productId, update) {
        return await this.model.updateOne({ _id: productId }, update);
    }

    async deleteProduct(productId) {
        return await this.model.deleteOne({ _id: productId })
    }

}

const productDAO = new ProductDAO();
export default productDAO;