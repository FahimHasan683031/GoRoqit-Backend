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
exports.Profile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_interface_1 = require("../user/user.interface");
const EducationSchema = new mongoose_1.Schema({
    degreeTitle: { type: String, required: true },
    instituteName: { type: String, required: true },
    major: String,
    result: String,
    grade: String,
    startDate: Date,
    endDate: Date,
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
    duration: String,
}, { _id: false });
const ApplicantDataSchema = new mongoose_1.Schema({
    resume: String,
    skills: { type: [String], default: [] },
    education: { type: [EducationSchema], default: [] },
    workExperience: { type: [WorkExperienceSchema], default: [] },
    preferredWorkType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Internship", "Other"],
    },
    languages: [String],
    salaryExpectation: String,
    openToWork: { type: Boolean, default: false },
}, { _id: false, strict: false });
const RecruiterDataSchema = new mongoose_1.Schema({
    companyName: { type: String, required: true },
    companyWebsite: String,
    companyDescription: String,
    companyLogo: String,
}, { _id: false, strict: false });
const AdminDataSchema = new mongoose_1.Schema({
    permissions: { type: [String], default: [] },
}, { _id: false, strict: false });
const ProfileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.USER_ROLES),
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 50
    },
    image: String,
    phone: String,
    bio: {
        type: String,
        maxlength: 500
    },
    // Role-specific data
    applicantData: { type: ApplicantDataSchema },
    recruiterData: { type: RecruiterDataSchema },
    adminData: { type: AdminDataSchema },
}, { timestamps: true });
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ role: 1 });
ProfileSchema.index({ "applicantData.skills": 1 });
ProfileSchema.index({ "applicantData.openToWork": 1 });
ProfileSchema.index({ "recruiterData.companyName": 1 });
ProfileSchema.index({ firstName: "text", lastName: "text", bio: "text" });
exports.Profile = mongoose_1.default.model("Profile", ProfileSchema);
