import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    purchase_datetime: String,
    amount: Number,
    purchase: String,
});

const ticketModel = mongoose.model('tickets', ticketSchema);

export default ticketModel;