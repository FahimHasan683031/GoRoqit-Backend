import { Request, Response } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./category.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

// create category
export const createCategoryController = async (req: Request, res: Response) => {
  const payload = req.body;
  const category = await createCategory(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Category created successfully',
    data: category,
  })
};

// get categories
export const getCategoriesController = async (req: Request, res: Response) => {
  const categories = await getCategories(req.query);
 sendResponse(res, {
  statusCode: StatusCodes.OK,
  success: true,
  message: 'Categories retrieved successfully',
  data: categories,
 })
};

// Delete category
export const deleteCategoryController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const category = await deleteCategory(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category deleted successfully',
    data: category,
  })
};

// Update category
export const updateCategoryController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const category = await updateCategory(id, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category updated successfully',
    data: category,
  })
};