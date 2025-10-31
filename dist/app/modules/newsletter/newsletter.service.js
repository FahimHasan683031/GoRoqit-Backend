"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterService = exports.deleteAllNewsletters = exports.deleteNewsletter = exports.getAllNewsletters = exports.createNewsletter = void 0;
const newsletter_modle_1 = require("./newsletter.modle");
// create newsletter
const createNewsletter = async (data) => {
    const newsletter = await newsletter_modle_1.Newsletter.create(data);
    return newsletter;
};
exports.createNewsletter = createNewsletter;
// get all newsletters
const getAllNewsletters = async () => {
    const newsletters = await newsletter_modle_1.Newsletter.find();
    return newsletters;
};
exports.getAllNewsletters = getAllNewsletters;
// delete newsletter
const deleteNewsletter = async (id) => {
    const newsletter = await newsletter_modle_1.Newsletter.findByIdAndDelete(id);
    return newsletter;
};
exports.deleteNewsletter = deleteNewsletter;
// delete all newsletters
const deleteAllNewsletters = async () => {
    const newsletters = await newsletter_modle_1.Newsletter.deleteMany();
    return newsletters;
};
exports.deleteAllNewsletters = deleteAllNewsletters;
exports.newsletterService = {
    createNewsletter: exports.createNewsletter,
    getAllNewsletters: exports.getAllNewsletters,
    deleteNewsletter: exports.deleteNewsletter,
    deleteAllNewsletters: exports.deleteAllNewsletters,
};
