import productModel from '../../models/products.model.js'

export default class ProductService {
    constructor() {
        this.model = productModel;
    }

    async getProducts(limit, page, filter, sort) {
        return await this.model.paginate({}, { lean: true, limit, page, sort: { price: sort } });
    }

    async addProduct(product) {
        return await this.model.create(product);
    }

    async getProductById(id) {
        return await this.model.findOne({ _id: id });
    }

    async getProductByCode(productCode) {
        return await this.model.findOne({ code: productCode });
    }

    async updateProduct(id, product) {
        return await this.model.updateOne({ _id: id }, product);
    }

    async deleteProduct(id) {
        return await this.model.deleteOne({ _id: id });
    }
}