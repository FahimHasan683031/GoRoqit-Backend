import express from 'express';
import { ApplicationController } from './application.controller';
import { ApplicationValidations } from './application.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
    USER_ROLES.APPLICANT,
    USER_ROLES.GUEST
  ),
  ApplicationController.getAllApplications
);

router.get(
  '/:id',
  auth(
    USER_ROLES.RECRUITER,
    USER_ROLES.ADMIN,
    USER_ROLES.APPLICANT,
    USER_ROLES.GUEST
  ),
  ApplicationController.getSingleApplication
);

router.post(
  '/',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.GUEST
  ),
  
  validateRequest(ApplicationValidations.create),
  ApplicationController.createApplication
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.GUEST
  ),
  
  validateRequest(ApplicationValidations.update),
  ApplicationController.updateApplication
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.RECRUITER,
    USER_ROLES.ADMIN
  ),
  ApplicationController.deleteApplication
);

export const ApplicationRoutes = router;