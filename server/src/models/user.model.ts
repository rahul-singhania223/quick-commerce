import db from "../configs/db.config.js";
import { User } from "../generated/prisma/client.js";
import { ApiError } from "../utils/api-error.js";

// GET USER (PHONE)
export const getUserByPhone = async (phone: string) => {
  try {
    const data = await db.user.findUnique({
      where: {
        phone,
      },
    });

    return data;
  } catch (error) {
    return null;
  }
};

// GET USER BY ID
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    return null;
  }
};

// CREATE USER
export const createUser = async (data: User) => {
  try {
    const user = await db.user.create({ data });
    return user;
  } catch (error) {
    throw new ApiError(500, "DB_ERROR", "Couldn't create user", error);
  }
};

// UPDATE USER
export const updateUser = async (id: string, data: User) => {
  try {
    const user = await db.user.update({ where: { id }, data });
    return user;
  } catch (error) {
    throw new ApiError(500, "DB_ERROR", "Couldn't update user", error);
  }
};
