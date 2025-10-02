"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = require("mongoose");
const ApplicationSchema = new mongoose_1.Schema({
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String, required: true },
    experience: { type: String, required: true },
}, {
    timestamps: true
});
exports.Application = (0, mongoose_1.model)('Application', ApplicationSchema);
