import express from 'express';
import { ChatController } from './chat.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.interface';
import { JwtPayload } from 'jsonwebtoken';
const router = express.Router();

router.route("/")
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
    async (req, res, next) => {
      try {
        req.body = [(req.user as JwtPayload).authId, ...req.body.participants];
        next();
      } catch (error) {
        res.status(400).json({ message: "Failed to create chat" });
      }
    },
    ChatController.createChat
  )
  .get(
    auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
    ChatController.getChat
  );

export const ChatRoutes = router;
