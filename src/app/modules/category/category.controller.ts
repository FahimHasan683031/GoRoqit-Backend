import { Request, Response } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./category.service";

// create category
export const createCategoryController = async (req: Request, res: Response) => {
  const payload = req.body;
  const category = await createCategory(payload);
  res.json(category);
};

// get categories
export const getCategoriesController = async (req: Request, res: Response) => {
  const categories = await getCategories();
  res.json(categories);
};

// Delete category
export const deleteCategoryController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const category = await deleteCategory(id);
  res.json(category);
};

// Update category
export const updateCategoryController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const category = await updateCategory(id, payload);
  res.json(category);
};