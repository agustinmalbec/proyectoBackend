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

const cartModel = model('carts', cartSchema);

export default cartModel;