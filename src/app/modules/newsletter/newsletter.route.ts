import express from 'express';
import { newsletterController } from './newsletter.controller';

const router = express.Router();

router.post('/', newsletterController.createNewsletter);
router.get('/', newsletterController.getAllNewsletters);
router.delete('/:id', newsletterController.deleteNewsletter);
router.delete('/all', newsletterController.deleteAllNewsletters);

export const newsletterRoutes = router;