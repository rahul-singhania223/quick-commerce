import db from "../configs/db.config.ts";
import { User } from "../generated/prisma/client.ts";
import { ApiError } from "../utils/api-error.ts";

// GET USER (PHONE)
export const getUserByPhone = async (phone: string) => {
  try {
    const data = db.user.findUnique({
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
    const user = db.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    return null;
  }
};

// CREATE USER
export const createUser = async (data: User) => {
  try {
    const user = db.user.create({ data });
    return user;
  } catch (error) {
    throw new ApiError(500, "DB_ERROR", "Couldn't create user", error);
  }
};

// UPDATE USER
export const updateUser = async (id: string, data: User) => {
  try {
    const user = db.user.update({ where: { id }, data });
    return user;
  } catch (error) {
    throw new ApiError(500, "DB_ERROR", "Couldn't update user", error);
  }
};
