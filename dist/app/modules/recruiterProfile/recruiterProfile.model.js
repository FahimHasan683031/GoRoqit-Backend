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
exports.RecruiterProfile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RecruiterProfileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    companyName: { type: String, required: true },
    companyWebsite: { type: String, default: null },
    companyDescription: { type: String, default: null },
    companyLogo: { type: String, default: null },
    phone: { type: String, default: null },
    companyEmail: { type: String, default: null },
    location: { type: String, default: null },
    linkedinProfile: { type: String, default: null },
    twitterProfile: { type: String, default: null },
    facebookProfile: { type: String, default: null },
    instagramProfile: { type: String, default: null },
    bio: { type: String, maxlength: 500 },
}, { timestamps: true });
RecruiterProfileSchema.index({ userId: 1 });
RecruiterProfileSchema.index({ companyName: 1 });
exports.RecruiterProfile = mongoose_1.default.model("RecruiterProfile", RecruiterProfileSchema);
