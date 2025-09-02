import express from 'express';
import { ApplicantController } from './applicant.controller';
import { ApplicantValidations } from './applicant.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
  ),
  ApplicantController.getAllApplicants
);

router.get(
  '/:id',
  auth(
    USER_ROLES.RECRUITER,
    USER_ROLES.ADMIN
  ),
  ApplicantController.getSingleApplicant
);

router.post(
  '/',
  auth(
    USER_ROLES.APPLICANT
  ),
  
  validateRequest(ApplicantValidations.create),
  ApplicantController.createApplicant
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.APPLICANT
  ),
  
  validateRequest(ApplicantValidations.update),
  ApplicantController.updateApplicant
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.RECRUITER,
    USER_ROLES.ADMIN
  ),
  ApplicantController.deleteApplicant
);

export const ApplicantRoutes = router;