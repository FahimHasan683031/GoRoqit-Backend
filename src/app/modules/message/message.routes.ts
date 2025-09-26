import express from 'express';
import { MessageController } from './message.controller';
import { USER_ROLES } from '../user/user.interface';
import auth from '../../middleware/auth';
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody';
const router = express.Router();




router.post('/',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
   fileAndBodyProcessorUsingDiskStorage(),
  MessageController.sendMessage
);


router.get(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
  MessageController.getMessage
);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
  fileAndBodyProcessorUsingDiskStorage(),
  MessageController.updateMessage
);
router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
  MessageController.deleteMessage
);


export const MessageRoutes = router;
