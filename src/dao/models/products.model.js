import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnails: {
        type: Array,
        required: true,
        default: [],
    },
    code: {
        type: Number,
        unique: true,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        require: true,
        default: true,
    },
});

const productModel = model('products', productSchema);

export default productModel;