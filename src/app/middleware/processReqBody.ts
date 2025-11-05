import { Request, Response, NextFunction } from 'express'
import multer, { FileFilterCallback } from 'multer'
import ApiError from '../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'

type IFolderName =
  | 'image'
  | 'media'
  | 'documents'
  | 'resume'
  | 'companyLogo'
  | 'certificate'
  | 'portfolio'

interface ProcessedFiles {
  [key: string]: string | string[] | undefined
}

// ✅ Added certificate (max 10) and portfolio (max 25)
const uploadFields = [
  { name: 'image', maxCount: 1 },
  { name: 'media', maxCount: 3 },
  { name: 'documents', maxCount: 3 },
  { name: 'resume', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 },
  { name: 'certificate', maxCount: 10 },
  { name: 'portfolio', maxCount: 25 },
] as const

// ========== MEMORY STORAGE ==============
export const fileAndBodyProcessor = () => {
  const storage = multer.memoryStorage()

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    try {
      const allowedTypes = {
        image: ['image/jpeg', 'image/png', 'image/jpg'],
        resume: ['application/pdf'],
        companyLogo: ['image/jpeg', 'image/png', 'image/jpg'],
        media: ['video/mp4', 'audio/mpeg'],
        documents: ['application/pdf'],
        certificate: ['application/pdf', 'image/jpeg', 'image/png'], // ✅ allowed types
        portfolio: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'], // ✅ allowed types
      }

      const fieldType = file.fieldname as IFolderName
      if (!allowedTypes[fieldType]?.includes(file.mimetype)) {
        return cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            `Invalid file type for ${file.fieldname}`,
          ),
        )
      }
      cb(null, true)
    } catch (error) {
      cb(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'File validation failed',
        ),
      )
    }
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024, files: 50 }, // allow more files
  }).fields(uploadFields)

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async error => {
      if (error) return next(error)

      try {
        if (req.body?.data) {
          req.body = JSON.parse(req.body.data)
        }

        if (req.files) {
          const processedFiles: ProcessedFiles = {}
          const fieldsConfig = new Map(
            uploadFields.map(f => [f.name, f.maxCount]),
          )

          for (const [fieldName, files] of Object.entries(req.files)) {
            const maxCount = fieldsConfig.get(fieldName as IFolderName) ?? 1
            const fileArray = files as Express.Multer.File[]
            const paths: string[] = []

            for (const file of fileArray) {
              const extension = file.mimetype.split('/')[1]
              const filename = `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}.${extension}`
              const filePath = `/${fieldName}/${filename}`

              // Optimize images
              if (
                ['image', 'portfolio', 'companyLogo', 'certificate'].includes(
                  fieldName,
                ) &&
                file.mimetype.startsWith('image/')
              ) {
                try {
                  let sharpInstance = sharp(file.buffer).resize(800)
                  if (file.mimetype === 'image/png') {
                    sharpInstance = sharpInstance.png({ quality: 80 })
                  } else {
                    sharpInstance = sharpInstance.jpeg({ quality: 80 })
                  }
                  const optimizedBuffer = await sharpInstance.toBuffer()
                  file.buffer = optimizedBuffer
                } catch (err) {
                  console.error('Image optimization failed:', err)
                }
              }

              paths.push(filePath)
            }

            processedFiles[fieldName] = maxCount > 1 ? paths : paths[0]
          }

          req.body = { ...req.body, ...processedFiles }
        }

        next()
      } catch (err) {
        next(err)
      }
    })
  }
}


export const fileAndBodyProcessorUsingDiskStorage = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(uploadsDir, file.fieldname);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const extension =
        path.extname(file.originalname) || `.${file.mimetype.split('/')[1]}`;
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}${extension}`;
      cb(null, filename);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    try {
      const allowedTypes = {
        image: ['image/jpeg', 'image/png', 'image/jpg'],
        media: ['video/mp4', 'audio/mpeg'],
        documents: ['application/pdf'],
        resume: ['application/pdf'],
        companyLogo: ['image/jpeg', 'image/png', 'image/jpg'],
        certificate: ['application/pdf', 'image/jpeg', 'image/png'],
        portfolio: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
      };

      const fieldType = file.fieldname as IFolderName;
      if (!allowedTypes[fieldType]?.includes(file.mimetype)) {
        return cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            `Invalid file type for ${file.fieldname}`,
          ),
        );
      }
      cb(null, true);
    } catch (error) {
      cb(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'File validation failed',
        ),
      );
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024, files: 50 },
  }).fields(uploadFields);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async (error) => {
      if (error) return next(error);

      try {
        // Parse JSON wrapper
        if (req.body?.data) {
          req.body = JSON.parse(req.body.data);
        }

        if (!req.files) {
          return next();
        }

        const processedFiles: ProcessedFiles = {};
        const fieldsConfig = new Map(
          uploadFields.map((f) => [f.name, f.maxCount]),
        );

        // Process ALL fields in parallel
        await Promise.all(
          Object.entries(req.files).map(async ([fieldName, files]) => {
            const fileArray = files as Express.Multer.File[];
            const maxCount = fieldsConfig.get(fieldName as IFolderName) ?? 1;
            const paths: string[] = [];

            // Optimize ALL images in this field in parallel
            await Promise.all(
              fileArray.map(async (file) => {
                const filePath = `/${fieldName}/${file.filename}`;
                paths.push(filePath);

                // Only optimize images
                if (
                  ['image', 'portfolio', 'companyLogo', 'certificate'].includes(
                    fieldName,
                  ) &&
                  file.mimetype.startsWith('image/')
                ) {
                  const fullPath = path.join(uploadsDir, fieldName, file.filename);
                  const tempPath = fullPath + '.opt';

                  try {
                    let sharpInstance = sharp(fullPath)
                      .rotate() // fix orientation
                      .resize(800, null, { withoutEnlargement: true });

                    if (file.mimetype === 'image/png') {
                      sharpInstance = sharpInstance.png({ quality: 80 });
                    } else {
                      sharpInstance = sharpInstance.jpeg({
                        quality: 80,
                        mozjpeg: true,
                      });
                    }

                    await sharpInstance.toFile(tempPath);
                    fs.unlinkSync(fullPath);
                    fs.renameSync(tempPath, fullPath);
                  } catch (err) {
                    console.error(`Failed to optimize ${filePath}:`, err);
                    // Don't fail upload if optimization fails
                  }
                }
              }),
            );

            processedFiles[fieldName] = maxCount > 1 ? paths : paths[0];
          }),
        );

        // Merge exactly as you had
        req.body = {
          ...req.body,
          companyLogo: processedFiles.companyLogo,
          resume: processedFiles.resume,
          image: processedFiles.image,
          portfolioImages: processedFiles.portfolio, // ← your custom key
          certificate: processedFiles.certificate,
        };

        next();
      } catch (err) {
        next(err);
      }
    });
  };
};





// export const fileAndBodyProcessorUsingDiskStorage = () => {
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
//         certificate: ['application/pdf', 'image/jpeg', 'image/png'], // ✅ allowed
//         portfolio: ['image/jpeg', 'image/png', 'application/pdf'], // ✅ allowed
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
//         if (req.body?.data) {
//           req.body = JSON.parse(req.body.data)
//         }

//         if (req.files) {
//           const processedFiles: ProcessedFiles = {}
//           const fieldsConfig = new Map(
//             uploadFields.map(f => [f.name, f.maxCount]),
//           )

//           for (const [fieldName, files] of Object.entries(req.files)) {
//             const maxCount = fieldsConfig.get(fieldName as IFolderName) ?? 1
//             const fileArray = files as Express.Multer.File[]
//             const paths: string[] = []

//             for (const file of fileArray) {
//               const filePath = `/${fieldName}/${file.filename}`

//               // Optimize image files
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
//           console.log(processedFiles)
//           req.body = {
//             ...req.body,
//             companyLogo: processedFiles.companyLogo,
//             resume: processedFiles.resume,
//             image: processedFiles.image,
//             portfolioImages: processedFiles.portfolio,
//           }
//         }

//         next()
//       } catch (err) {
//         next(err)
//       }
//     })
//   }
// }



