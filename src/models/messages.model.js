import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    user: String,
    message: [String],
});

const messageModel = model('messages', messageSchema);

export default messageModel;