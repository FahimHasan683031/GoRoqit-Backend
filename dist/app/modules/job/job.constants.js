"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSetEqual = exports.jobSearchableFields = exports.jobFilterables = void 0;
// Filterable fields for Job
exports.jobFilterables = ['title', 'category', 'userEmail', 'description', 'responsibilities', 'minSalary', 'maxSalary'];
// Searchable fields for Job
exports.jobSearchableFields = ['title', 'category', 'jobLocation'];
// Helper function for set comparison
const isSetEqual = (setA, setB) => {
    if (setA.size !== setB.size)
        return false;
    for (const item of setA) {
        if (!setB.has(item))
            return false;
    }
    return true;
};
exports.isSetEqual = isSetEqual;
