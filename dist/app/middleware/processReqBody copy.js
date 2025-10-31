"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileAndBodyProcessorUsingDiskStorage = exports.fileAndBodyProcessor = void 0;
const multer_1 = __importDefault(require("multer"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
// ✅ Added certificate (max 10) and portfolio (max 25)
const uploadFields = [
    { name: 'image', maxCount: 1 },
    { name: 'media', maxCount: 3 },
    { name: 'documents', maxCount: 3 },
    { name: 'resume', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 },
    { name: 'certificate', maxCount: 10 },
    { name: 'portfolio', maxCount: 25 },
];
// ========== MEMORY STORAGE ==============
const fileAndBodyProcessor = () => {
    const storage = multer_1.default.memoryStorage();
    const fileFilter = (req, file, cb) => {
        var _a;
        try {
            const allowedTypes = {
                image: ['image/jpeg', 'image/png', 'image/jpg'],
                resume: ['application/pdf'],
                companyLogo: ['image/jpeg', 'image/png', 'image/jpg'],
                media: ['video/mp4', 'audio/mpeg'],
                documents: ['application/pdf'],
                certificate: ['application/pdf', 'image/jpeg', 'image/png'], // ✅ allowed types
                portfolio: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'], // ✅ allowed types
            };
            const fieldType = file.fieldname;
            if (!((_a = allowedTypes[fieldType]) === null || _a === void 0 ? void 0 : _a.includes(file.mimetype))) {
                return cb(new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid file type for ${file.fieldname}`));
            }
            cb(null, true);
        }
        catch (error) {
            cb(new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'File validation failed'));
        }
    };
    const upload = (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: 10 * 1024 * 1024, files: 50 }, // allow more files
    }).fields(uploadFields);
    return (req, res, next) => {
        upload(req, res, async (error) => {
            var _a, _b;
            if (error)
                return next(error);
            try {
                if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
                    req.body = JSON.parse(req.body.data);
                }
                if (req.files) {
                    const processedFiles = {};
                    const fieldsConfig = new Map(uploadFields.map(f => [f.name, f.maxCount]));
                    for (const [fieldName, files] of Object.entries(req.files)) {
                        const maxCount = (_b = fieldsConfig.get(fieldName)) !== null && _b !== void 0 ? _b : 1;
                        const fileArray = files;
                        const paths = [];
                        for (const file of fileArray) {
                            const extension = file.mimetype.split('/')[1];
                            const filename = `${Date.now()}-${Math.random()
                                .toString(36)
                                .slice(2)}.${extension}`;
                            const filePath = `/${fieldName}/${filename}`;
                            // Optimize images
                            if (['image', 'portfolio', 'companyLogo', 'certificate'].includes(fieldName) &&
                                file.mimetype.startsWith('image/')) {
                                try {
                                    let sharpInstance = (0, sharp_1.default)(file.buffer).resize(800);
                                    if (file.mimetype === 'image/png') {
                                        sharpInstance = sharpInstance.png({ quality: 80 });
                                    }
                                    else {
                                        sharpInstance = sharpInstance.jpeg({ quality: 80 });
                                    }
                                    const optimizedBuffer = await sharpInstance.toBuffer();
                                    file.buffer = optimizedBuffer;
                                }
                                catch (err) {
                                    console.error('Image optimization failed:', err);
                                }
                            }
                            paths.push(filePath);
                        }
                        processedFiles[fieldName] = maxCount > 1 ? paths : paths[0];
                    }
                    req.body = { ...req.body, ...processedFiles };
                }
                next();
            }
            catch (err) {
                next(err);
            }
        });
    };
};
exports.fileAndBodyProcessor = fileAndBodyProcessor;
// ========== DISK STORAGE ==============
const fileAndBodyProcessorUsingDiskStorage = () => {
    const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const folderPath = path_1.default.join(uploadsDir, file.fieldname);
            if (!fs_1.default.existsSync(folderPath)) {
                fs_1.default.mkdirSync(folderPath, { recursive: true });
            }
            cb(null, folderPath);
        },
        filename: (req, file, cb) => {
            const extension = path_1.default.extname(file.originalname) || `.${file.mimetype.split('/')[1]}`;
            const filename = `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}${extension}`;
            cb(null, filename);
        },
    });
    const fileFilter = (req, file, cb) => {
        var _a;
        try {
            const allowedTypes = {
                image: [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/bmp',
                    'image/webp',
                    'image/tiff',
                    'image/svg+xml',
                    'image/heic', // iOS format
                    'image/heif', // iOS format
                    'image/avif',
                    'image/x-icon',
                ],
                media: ['video/mp4', 'audio/mpeg'],
                documents: ['application/pdf'],
                resume: ['application/pdf'],
                companyLogo: [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/bmp',
                    'image/webp',
                    'image/tiff',
                    'image/svg+xml',
                    'image/heic', // iOS format
                    'image/heif', // iOS format
                    'image/avif',
                    'image/x-icon',
                ],
                certificate: ['application/pdf', 'image/jpeg', 'image/png'], // ✅ allowed
                portfolio: [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/bmp',
                    'image/webp',
                    'image/tiff',
                    'image/svg+xml',
                    'image/heic', // iOS format
                    'image/heif', // iOS format
                    'image/avif',
                    'image/x-icon',
                ],
                // ✅ allowed
            };
            const fieldType = file.fieldname;
            if (!((_a = allowedTypes[fieldType]) === null || _a === void 0 ? void 0 : _a.includes(file.mimetype))) {
                return cb(new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid file type for ${file.fieldname}`));
            }
            cb(null, true);
        }
        catch (error) {
            cb(new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'File validation failed'));
        }
    };
    const upload = (0, multer_1.default)({
        storage,
        fileFilter,
        limits: { fileSize: 10 * 1024 * 1024, files: 50 },
    }).fields(uploadFields);
    return (req, res, next) => {
        upload(req, res, async (error) => {
            var _a, _b;
            if (error)
                return next(error);
            try {
                if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
                    req.body = JSON.parse(req.body.data);
                }
                if (req.files) {
                    const processedFiles = {};
                    const fieldsConfig = new Map(uploadFields.map(f => [f.name, f.maxCount]));
                    for (const [fieldName, files] of Object.entries(req.files)) {
                        const maxCount = (_b = fieldsConfig.get(fieldName)) !== null && _b !== void 0 ? _b : 1;
                        const fileArray = files;
                        const paths = [];
                        for (const file of fileArray) {
                            const filePath = `/${fieldName}/${file.filename}`;
                            // Optimize image files
                            if (['image', 'portfolio', 'companyLogo', 'certificate'].includes(fieldName) &&
                                file.mimetype.startsWith('image/')) {
                                try {
                                    const fullPath = path_1.default.join(uploadsDir, fieldName, file.filename);
                                    let sharpInstance = (0, sharp_1.default)(fullPath).resize(800);
                                    if (file.mimetype === 'image/png') {
                                        sharpInstance = sharpInstance.png({ quality: 80 });
                                    }
                                    else {
                                        sharpInstance = sharpInstance.jpeg({ quality: 80 });
                                    }
                                    await sharpInstance.toFile(fullPath + '.optimized');
                                    fs_1.default.unlinkSync(fullPath);
                                    fs_1.default.renameSync(fullPath + '.optimized', fullPath);
                                }
                                catch (err) {
                                    console.error('Image optimization failed:', err);
                                }
                            }
                            paths.push(filePath);
                        }
                        processedFiles[fieldName] = maxCount > 1 ? paths : paths[0];
                    }
                    console.log(processedFiles);
                    req.body = {
                        ...req.body,
                        companyLogo: processedFiles.companyLogo,
                        resume: processedFiles.resume,
                        image: processedFiles.image,
                    };
                }
                next();
            }
            catch (err) {
                next(err);
            }
        });
    };
};
exports.fileAndBodyProcessorUsingDiskStorage = fileAndBodyProcessorUsingDiskStorage;
// import { Request, Response, NextFunction } from 'express'
// import multer, { FileFilterCallback } from 'multer'
// import ApiError from '../../errors/ApiError'
// import { StatusCodes } from 'http-status-codes'
// import path from 'path'
// import fs from 'fs'
// import sharp from 'sharp'
// type IFolderName =
//   | 'image'
//   | 'media'
//   | 'documents'
//   | 'resume'
//   | 'companyLogo'
//   | 'certificate'
//   | 'portfolio'
// interface ProcessedFiles {
//   [key: string]: string | string[] | undefined
// }
// const uploadFields = [
//   { name: 'image', maxCount: 1 },
//   { name: 'media', maxCount: 3 },
//   { name: 'documents', maxCount: 3 },
//   { name: 'resume', maxCount: 1 },
//   { name: 'companyLogo', maxCount: 1 },
//   { name: 'certificate', maxCount: 10 },
//   { name: 'portfolio', maxCount: 25 },
// ] as const
// export const fileAndBodyProcessorUsingDiskStorage = () => {
//   console.log('hit hit fileAndBodyProcessorUsingDiskStorage');
//   const uploadsDir = path.join(process.cwd(), 'uploads')
//   if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true })
//   }
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const folderPath = path.join(uploadsDir, file.fieldname)
//       if (!fs.existsSync(folderPath)) {
//         fs.mkdirSync(folderPath, { recursive: true })
//       }
//       cb(null, folderPath)
//     },
//     filename: (req, file, cb) => {
//       const extension =
//         path.extname(file.originalname) || `.${file.mimetype.split('/')[1]}`
//       const filename = `${Date.now()}-${Math.random()
//         .toString(36)
//         .slice(2, 8)}${extension}`
//       cb(null, filename)
//     },
//   })
//   const fileFilter = (
//     req: Request,
//     file: Express.Multer.File,
//     cb: FileFilterCallback,
//   ) => {
//     try {
//       const allowedTypes = {
//         image: ['image/jpeg', 'image/png', 'image/jpg'],
//         media: ['video/mp4', 'audio/mpeg'],
//         documents: ['application/pdf'],
//         resume: ['application/pdf'],
//         companyLogo: ['image/jpeg', 'image/png', 'image/jpg'],
//         certificate: ['application/pdf', 'image/jpeg', 'image/png'],
//         portfolio: ['image/jpeg', 'image/png', 'application/pdf'],
//       }
//       const fieldType = file.fieldname as IFolderName
//       if (!allowedTypes[fieldType]?.includes(file.mimetype)) {
//         return cb(
//           new ApiError(
//             StatusCodes.BAD_REQUEST,
//             `Invalid file type for ${file.fieldname}`,
//           ),
//         )
//       }
//       cb(null, true)
//     } catch (error) {
//       cb(
//         new ApiError(
//           StatusCodes.INTERNAL_SERVER_ERROR,
//           'File validation failed',
//         ),
//       )
//     }
//   }
//   const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 10 * 1024 * 1024, files: 50 },
//   }).fields(uploadFields)
//   return (req: Request, res: Response, next: NextFunction) => {
//     upload(req, res, async error => {
//       if (error) return next(error)
//       try {
//         // ✅ Parse incoming JSON body
//         if (req.body?.data) {
//           req.body = JSON.parse(req.body.data)
//         }
//         const processedFiles: ProcessedFiles = {}
//         const fieldsConfig = new Map(
//           uploadFields.map(f => [f.name, f.maxCount]),
//         )
//         // ✅ Handle File Uploads
//         if (req.files) {
//           for (const [fieldName, files] of Object.entries(req.files)) {
//             const maxCount = fieldsConfig.get(fieldName as IFolderName) ?? 1
//             const fileArray = files as Express.Multer.File[]
//             const paths: string[] = []
//             for (const file of fileArray) {
//               const filePath = `/${fieldName}/${file.filename}`
//               // ✅ Optimize image
//               if (
//                 ['image', 'portfolio', 'companyLogo', 'certificate'].includes(
//                   fieldName,
//                 ) &&
//                 file.mimetype.startsWith('image/')
//               ) {
//                 try {
//                   const fullPath = path.join(
//                     uploadsDir,
//                     fieldName,
//                     file.filename,
//                   )
//                   let sharpInstance = sharp(fullPath).resize(800)
//                   if (file.mimetype === 'image/png') {
//                     sharpInstance = sharpInstance.png({ quality: 80 })
//                   } else {
//                     sharpInstance = sharpInstance.jpeg({ quality: 80 })
//                   }
//                   await sharpInstance.toFile(fullPath + '.optimized')
//                   fs.unlinkSync(fullPath)
//                   fs.renameSync(fullPath + '.optimized', fullPath)
//                 } catch (err) {
//                   console.error('Image optimization failed:', err)
//                 }
//               }
//               paths.push(filePath)
//             }
//             processedFiles[fieldName] = maxCount > 1 ? paths : paths[0]
//           }
//         }
//         // ✅ Attach certificate to education
//         if (req.body.education && Array.isArray(req.body.education)) {
//           req.body.education = req.body.education.map(
//             (edu: any, index: number) => {
//               const certKey = `certificate_${index}`
//               const certFile =
//                 processedFiles[certKey] || processedFiles['certificate']
//               return { ...edu, certificate: certFile || edu.certificate }
//             },
//           )
//         }
//         // ✅ Attach portfolio if provided (future independent section)
//         if (req.body.portfolioSection) {
//           req.body.portfolioSection = {
//             ...req.body.portfolioSection,
//             files: processedFiles['portfolio'] || [],
//           }
//         }
//         // ✅ Maintain previous structure for image, logo, resume
//         req.body = {
//           ...req.body,
//           companyLogo: processedFiles.companyLogo,
//           resume: processedFiles.resume,
//           image: processedFiles.image,
//         }
//         next()
//       } catch (err) {
//         next(err)
//       }
//     })
//   }
// }
