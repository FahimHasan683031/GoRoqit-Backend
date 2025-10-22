import express from 'express';
import { newsletterController } from './newsletter.controller';

const router = express.Router();

router.post('/', newsletterController.createNewsletter);
router.get('/', newsletterController.getAllNewsletters);
router.delete('/all', newsletterController.deleteAllNewsletters);
router.delete('/:id', newsletterController.deleteNewsletter);


export const newsletterRoutes = router;