import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        default: [],
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            }
        ]
    },
});

cartSchema.pre('find', function () {
    this.populate('products.product');
});
cartSchema.pre('findOne', function () {
    this.populate('products.product');
});

const cartModel = model('carts', cartSchema);

export default cartModel;