"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const message_model_1 = require("./message.model");
const chat_model_1 = require("../chat/chat.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const checkMongooseIDValidation_1 = require("../../../shared/checkMongooseIDValidation");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
// send message to DB
const sendMessageToDB = async (payload) => {
    // save to DB
    const response = await message_model_1.Message.create(payload);
    if (!response) {
        throw new Error('Message not created');
    }
    //@ts-ignore
    const io = global.io;
    if (io && payload.chatId) {
        // send message to specific chatId Room
        io.emit(`getMessage::${payload === null || payload === void 0 ? void 0 : payload.chatId}`, response);
    }
    return response;
};
// get message from DB
const getMessageFromDB = async (id, user, query) => {
    (0, checkMongooseIDValidation_1.checkMongooseIDValidation)(id, 'Chat');
    const isExistChat = await chat_model_1.Chat.findById(id);
    if (!isExistChat) {
        throw new Error('Chat not found');
    }
    if (!isExistChat.participants.includes(user.authId)) {
        throw new Error('You are not participant of this chat');
    }
    const result = new QueryBuilder_1.default(message_model_1.Message.find({ chatId: id }).sort({ createdAt: -1 }), query).paginate();
    const messages = await result.modelQuery.exec();
    messages.reverse();
    const pagination = await result.getPaginationInfo();
    const participant = await chat_model_1.Chat.findById(id).populate({
        path: 'participants',
        select: '_id name image',
        match: {
            _id: { $ne: new mongoose_1.default.Types.ObjectId(user.id) },
        },
    });
    return { messages, pagination, participant: participant === null || participant === void 0 ? void 0 : participant.participants[0] };
};
// update message
const updateMessage = async (id, user, payload) => {
    (0, checkMongooseIDValidation_1.checkMongooseIDValidation)(id, 'Message');
    const isExistMessage = await message_model_1.Message.findById(id);
    if (!isExistMessage) {
        throw new Error('Message not found');
    }
    if (isExistMessage.sender.toString() !== user.authId) {
        throw new Error('You are not sender of this message');
    }
    const result = await message_model_1.Message.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new Error('Message not updated');
    }
    //@ts-ignore
    const io = global.io;
    if (io && result.chatId) {
        // send message to specific chatId Room
        io.emit(`getMessage::${result === null || result === void 0 ? void 0 : result.chatId}`, result);
    }
    return result;
};
// delete message
const deleteMessage = async (id, user) => {
    (0, checkMongooseIDValidation_1.checkMongooseIDValidation)(id, 'Message');
    const isExistMessage = await message_model_1.Message.findById(id);
    if (!isExistMessage) {
        throw new Error('Message not found');
    }
    if (isExistMessage.sender.toString() !== user.authId) {
        throw new Error('You are not sender of this message');
    }
    // unlink file if exist
    if (isExistMessage.image) {
        (0, unlinkFile_1.default)(isExistMessage.image);
    }
    await message_model_1.Message.findByIdAndDelete(id);
    return "Message Delete Successfully";
};
exports.MessageService = {
    sendMessageToDB,
    getMessageFromDB,
    updateMessage,
    deleteMessage,
};
