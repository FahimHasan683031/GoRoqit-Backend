import QueryBuilder from "../../builder/QueryBuilder";
import { Category } from "./category.model";


// create category
export const createCategory = async (payload: { name: string }) => {
  const category = await Category.create(payload);
  return category;
};


// get categories
export const getCategories = async (query: Record<string, unknown>) => {
 const categoryQueryBuilder = new QueryBuilder(Category.find(), query)
    .filter()
    .sort()
    .paginate()
   const categories = await categoryQueryBuilder.modelQuery
  const paginationInfo = await categoryQueryBuilder.getPaginationInfo()

  return {
    data: categories,
    meta: paginationInfo,
  }
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