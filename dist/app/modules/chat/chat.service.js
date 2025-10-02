"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const message_model_1 = require("../message/message.model");
const chat_model_1 = require("./chat.model");
const createChatToDB = async (payload) => {
    const isExistChat = await chat_model_1.Chat.findOne({
        participants: { $all: payload },
    });
    if (isExistChat) {
        return isExistChat;
    }
    const chat = await chat_model_1.Chat.create({ participants: payload });
    return chat;
};
const getChatFromDB = async (user, search) => {
    const query = {
        participants: { $in: [user.authId] },
    };
    // Populate only the matched participants
    const chats = await chat_model_1.Chat.find({ participants: { $in: [user.authId] } })
        .populate({
        path: 'participants',
        select: '_id name image email',
        match: { _id: { $ne: user.authId } }
    })
        .select('participants status')
        .lean();
    // Remove chats where participants array is empty after filtering
    const filteredChats = chats.filter(chat => chat.participants.length > 0);
    // Get all last messages in a single query
    const chatIds = filteredChats.map(chat => chat._id);
    const lastMessages = await message_model_1.Message.find({ chatId: { $in: chatIds } })
        .sort({ createdAt: -1 })
        .select('text image createdAt sender chatId')
        .limit(1)
        .lean();
    console.log(lastMessages);
    // Map last messages to their respective chats
    const lastMessageMap = new Map(lastMessages.map(msg => [msg.chatId.toString(), msg]));
    // Merge last messages with chat data
    return filteredChats.map(chat => ({
        ...chat,
        lastMessage: lastMessageMap.get(chat._id.toString()) || null,
    }));
};
exports.ChatService = { createChatToDB, getChatFromDB };
