import productModel from '../../models/products.model.js';

class ProductDAO {
    constructor() {
        this.model = productModel;
    }

    async getProducts(limit, page, filter, sort) {
        try {
            return await this.model.paginate({}, { lean: true, limit, page, sort: { price: sort } });
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getProductById(productId) {
        try {
            return await this.model.findOne({ _id: productId });
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
            const find = await this.model.findOne({ code: product.code });
            console.log(find);
            if (find !== null) {
                throw new Error("El campo CODE se encuentra repetido");
            }
            console.log('asd');
            return await this.model.create(product);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`)
        }
    }

    async updateProduct(productId, update) {
        try {
            return await this.model.updateOne({ _id: productId }, update);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteProduct(productId) {
        try {
            return await this.model.deleteOne({ _id: productId })
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }
}

const productDAO = new ProductDAO();
export default productDAO;