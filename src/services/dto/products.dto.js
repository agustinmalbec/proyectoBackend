export default class ProductDTO {
    constructor({ title, category, description, price, thumbnails, code, stock, owner }) {
        this.title = title;
        this.category = category;
        this.description = description;
        this.price = price;
        this.thumbnails = thumbnails;
        this.code = code;
        this.stock = stock;
        this.owner = owner
    }
}