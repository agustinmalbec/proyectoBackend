import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        default: 'user',
    }
});

userSchema.pre('find', function () {
    this.populate('cart');
});
userSchema.pre('findOne', function () {
    this.populate('cart');
});

const userModel = mongoose.model('users', userSchema);

export default userModel;