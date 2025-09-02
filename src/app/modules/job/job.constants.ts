// Filterable fields for Job
export const jobFilterables = ['title', 'category', 'userEmail', 'description', 'responsibilities'];

// Searchable fields for Job
export const jobSearchableFields = ['title', 'category'];

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};