"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const newsletter_controller_1 = require("./newsletter.controller");
const router = express_1.default.Router();
router.post('/', newsletter_controller_1.newsletterController.createNewsletter);
router.get('/', newsletter_controller_1.newsletterController.getAllNewsletters);
router.delete('/all', newsletter_controller_1.newsletterController.deleteAllNewsletters);
router.delete('/:id', newsletter_controller_1.newsletterController.deleteNewsletter);
exports.newsletterRoutes = router;
