"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAndCondition = void 0;
const mongoose_1 = require("mongoose");
const termsAndConditionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.TermsAndCondition = (0, mongoose_1.model)('TermsAndCondition', termsAndConditionSchema);
