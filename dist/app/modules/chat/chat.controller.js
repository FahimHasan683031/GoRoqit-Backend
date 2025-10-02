"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const chat_service_1 = require("./chat.service");
const createChat = (0, catchAsync_1.default)(async (req, res) => {
    const chat = await chat_service_1.ChatService.createChatToDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Create Chat Successfully',
        data: chat,
    });
});
const getChat = (0, catchAsync_1.default)(async (req, res) => {
    const chatList = await chat_service_1.ChatService.getChatFromDB(req.user, req.query.search);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Chat Retrieve Successfully',
        data: chatList
    });
});
exports.ChatController = {
    createChat,
    getChat
};
