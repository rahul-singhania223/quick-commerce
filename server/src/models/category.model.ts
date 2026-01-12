import db from "../configs/db.config.ts";
import { Category } from "../generated/prisma/client.ts";

// get all categories
export const getAllCategories = async () => {
  try {

    // TODO: Add pagination

    const categories = await db.category.findMany({});
    return categories;
  } catch (error) {
    return null;
  }
};

// get category
export const getCategory = async ({
  id,
  slug,
  name,
}: {
  id?: string;
  slug?: string;
  name?: string;
}) => {
  const constraints = [];

  if (id) constraints.push({ id });
  if (slug) constraints.push({ slug });
  if (name) constraints.push({ name });

  if (constraints.length === 0) return null;

  return db.category.findFirst({
    where: {
      OR: constraints,
    },
  });
};

// create category
export const createCategory = async (data: Category) => {
  try {
    const category = await db.category.create({ data });
    return category;
  } catch (error) {
    return null;
  }
};

// update category
export const updateCategory = async (id: string, data: Category) => {
  try {
    const category = await db.category.update({ where: { id }, data });
    return category;
  } catch (error) {
    return null;
  }
};

// delete category
export const deleteCategory = async (id: string) => {
  try {
    const category = await db.category.delete({ where: { id } });
    return category;
  } catch (error) {
    return null;
  }
};
