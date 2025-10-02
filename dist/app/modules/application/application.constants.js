"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSetEqual = exports.ApplicationSearchableFields = exports.ApplicationFilterables = void 0;
// Filterable fields for Application
exports.ApplicationFilterables = ['name', 'title', 'location', 'email', 'phone', 'resume'];
// Searchable fields for Application
exports.ApplicationSearchableFields = ['name', 'title', 'location', 'email', 'phone', 'resume'];
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
