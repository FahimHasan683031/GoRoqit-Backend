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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_interface_1 = require("./user.interface");
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const config_1 = __importDefault(require("../../../config"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    status: {
        type: String,
        enum: Object.values(user_interface_1.USER_STATUS),
        default: user_interface_1.USER_STATUS.ACTIVE,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.USER_ROLES),
    },
    name: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
    profile: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: "roleProfile",
        default: null,
    },
    roleProfile: {
        type: String,
        enum: ["ApplicantProfile", "RecruiterProfile", null],
        default: null,
    },
    companyName: {
        type: String,
        required: false,
    },
    profileCompletion: { type: Number, default: 0 },
    authentication: {
        _id: false,
        select: false,
        type: {
            restrictionLeftAt: {
                type: Date,
                default: null,
            },
            resetPassword: {
                type: Boolean,
                default: false,
            },
            wrongLoginAttempts: {
                type: Number,
                default: 0,
            },
            passwordChangedAt: {
                type: Date,
                default: null,
            },
            oneTimeCode: {
                type: String,
                default: null,
            },
            latestRequestAt: {
                type: Date,
                default: null,
            },
            expiresAt: {
                type: Date,
                default: null,
            },
            requestCount: {
                type: Number,
                default: 0,
            },
            authType: {
                type: String,
                default: null,
            },
        },
    },
    subscribe: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});
// UserSchema.index({ email: 1, status: 1 });
UserSchema.statics.isPasswordMatched = async function (givenPassword, savedPassword) {
    return bcrypt_1.default.compare(givenPassword, savedPassword);
};
UserSchema.pre("save", async function (next) {
    const email = this.email;
    if (email) {
        const isExist = await exports.User.findOne({
            email: this.email,
            status: { $in: [user_interface_1.USER_STATUS.ACTIVE, user_interface_1.USER_STATUS.RESTRICTED] },
        });
        console.log(isExist);
        if (isExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "An account with this email already exists");
        }
    }
    if (this.password) {
        this.password = await bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    next();
});
exports.User = mongoose_1.default.model("User", UserSchema);
