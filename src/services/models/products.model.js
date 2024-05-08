import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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
        required: true,
        default: true,
    },
    owner: {
        type: String,
        default: 'admin',
    }
});

productSchema.plugin(mongoosePaginate);

const productModel = model('products', productSchema);

export default productModel;