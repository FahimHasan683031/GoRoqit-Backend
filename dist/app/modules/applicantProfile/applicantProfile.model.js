"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantProfile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const EducationSchema = new mongoose_1.Schema({
    degreeTitle: { type: String, required: true },
    instituteName: { type: String, required: true },
    major: String,
    result: String,
    scale: String,
    duration: String,
    yearOfPassing: Number,
    cgpa: Number,
}, { _id: false });
const WorkExperienceSchema = new mongoose_1.Schema({
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    location: String,
    employmentType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Internship", "Other"],
    },
    startDate: Date,
    endDate: Date,
    experience: String,
}, { _id: false });
const ApplicantProfileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    resume: { type: String, default: null },
    skills: { type: [String], default: [] },
    education: { type: [EducationSchema], default: [] },
    workExperience: { type: [WorkExperienceSchema], default: [] },
    preferredWorkType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Internship", "Other"],
        default: null,
    },
    languages: { type: [String], default: [] },
    salaryExpectation: { type: String, default: null },
    expartes: { type: [String], default: [] },
    openToWork: { type: Boolean, default: false },
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },
    middleName: { type: String, trim: true, maxlength: 50 },
    preferredName: { type: String, trim: true, maxlength: 50 },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"], default: null },
    citizenship: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    age: { type: Number, default: null },
    previousEmployment: { type: String, enum: ["Yes", "No"], default: null },
    streetAddress: { type: String, default: null },
    country: { type: String, default: null },
    city: { type: String, default: null },
    zipCode: { type: String, default: null },
    province: { type: String, default: null },
    mobile: { type: String, default: null },
    landLine: { type: String, default: null },
    bio: { type: String, maxlength: 500, default: null },
}, { timestamps: true });
ApplicantProfileSchema.index({ userId: 1 });
ApplicantProfileSchema.index({ skills: 1 });
ApplicantProfileSchema.index({ openToWork: 1 });
exports.ApplicantProfile = mongoose_1.default.model("ApplicantProfile", ApplicantProfileSchema);
