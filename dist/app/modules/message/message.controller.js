"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const message_service_1 = require("./message.service");
const sendMessage = (0, catchAsync_1.default)(async (req, res) => {
    req.body.sender = req.user.authId;
    const message = await message_service_1.MessageService.sendMessageToDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Send Message Successfully',
        data: message,
    });
});
const getMessage = (0, catchAsync_1.default)(async (req, res) => {
    const messages = await message_service_1.MessageService.getMessageFromDB(req.params.id, req.user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Message Retrieve Successfully',
        data: messages,
    });
});
const updateMessage = (0, catchAsync_1.default)(async (req, res) => {
    const message = await message_service_1.MessageService.updateMessage(req.params.id, req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Message Update Successfully',
        data: message,
    });
});
const deleteMessage = (0, catchAsync_1.default)(async (req, res) => {
    const message = await message_service_1.MessageService.deleteMessage(req.params.id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Message Delete Successfully',
        data: message,
    });
});
exports.MessageController = {
    sendMessage,
    getMessage,
    updateMessage,
    deleteMessage
};
