"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    category: { type: String },
    type: { type: String, enum: ['Full-time', 'Remote', 'Freelance', 'Part-time', 'Contract'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    description: { type: String },
    responsibilities: { type: String },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    jobLocation: { type: String, required: true },
    applicationsCount: { type: Number, default: 0 },
    experianceLabel: { type: String, enum: ['Experienced', 'Beginner', 'Freshers'], required: true },
}, {
    timestamps: true,
});
exports.Job = (0, mongoose_1.model)('Job', jobSchema);
