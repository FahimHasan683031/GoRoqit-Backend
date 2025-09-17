import express from 'express';
import { MessageController } from './message.controller';
// import { getSingleFilePath } from '../../../shared/getFilePath';
import { USER_ROLES } from '../user/user.interface';
import auth from '../../middleware/auth';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import { getSingleFilePath } from '../../../shared/getFilePath';
import { JwtPayload } from 'jsonwebtoken';
const router = express.Router();




router.post('/',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
  fileUploadHandler(),
  async (req, res, next) => {
    try {
      const image = getSingleFilePath(req.files, "image");
      req.body = {
        sender: (req.user as JwtPayload).authId,
        image,
        ...req.body
      };
      next();
    } catch (error) {
      res.status(400).json({ message: "Failed to upload Category Image" });
    }
  },
  MessageController.sendMessage
);


router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
  MessageController.getMessage
);

router.put(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
   fileUploadHandler(),
  async (req, res, next) => {
    try {
      const image = getSingleFilePath(req.files, "image");

      req.body = {
        sender: (req.user as JwtPayload).authId,
        image,
        ...req.body
      };
      next();
    } catch (error) {
      res.status(400).json({ message: "Failed to upload Category Image" });
    }
  },
  MessageController.updateMessage
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
  MessageController.deleteMessage
);


export const MessageRoutes = router;
