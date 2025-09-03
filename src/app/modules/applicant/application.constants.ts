// Filterable fields for Application
export const ApplicationFilterables = ['name', 'title', 'location', 'email', 'phone', 'resume'];

// Searchable fields for Application
export const ApplicationSearchableFields = ['name', 'title', 'location', 'email', 'phone', 'resume'];

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};