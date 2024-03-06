export default class ProductDTO {
    constructor({ title, category, description, price, thumbnail, code, stock }) {
        this.title = title;
        this.category = category;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}