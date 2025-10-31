"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = exports.userUpdateSchema = exports.userLoginSchema = exports.userSignupSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.userSignupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().toLowerCase().trim(),
        name: zod_1.z.string(),
        companyName: zod_1.z.string().optional(),
        role: zod_1.z.nativeEnum(user_interface_1.USER_ROLES),
        image: zod_1.z.string().optional(),
        password: zod_1.z.string().min(6),
    })
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase().trim(),
    password: zod_1.z.string().min(1),
});
exports.userUpdateSchema = zod_1.z.object({
    email: zod_1.z.string().email().trim().toLowerCase().optional(),
    name: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6).optional(),
    status: zod_1.z.nativeEnum(user_interface_1.USER_STATUS).optional(),
    verified: zod_1.z.boolean().optional(),
    companyName: zod_1.z.string().optional(),
    role: zod_1.z.nativeEnum(user_interface_1.USER_ROLES).optional(),
});
exports.UserValidations = {
    userSignupSchema: exports.userSignupSchema,
    userLoginSchema: exports.userLoginSchema,
    userUpdateSchema: exports.userUpdateSchema,
};
