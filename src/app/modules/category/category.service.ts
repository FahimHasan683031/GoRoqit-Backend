import { Category } from "./category.model";


// create category
export const createCategory = async (payload: { name: string }) => {
  const category = await Category.create(payload);
  return category;
};


// get categories
export const getCategories = async () => {
  const categories = await Category.find();
  return categories;
};

// Delete category
export const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);
  return category;
};

// Update category
export const updateCategory = async (id: string, payload: { name: string }) => {
  const category = await Category.findByIdAndUpdate(id, payload, { new: true });
  return category;
};