import db from "../configs/db.config.ts";
import { Store } from "../generated/prisma/client.ts";

// CREATE STORE
export const createStore = async (data: Store) => {
  try {
    const store = await db.store.create({ data });
    return store;
  } catch (error) {
    return null;
  }
};

// GET STORE
export const getStore = async (id: string) => {
  try {
    const store = await db.store.findUnique({ where: { id } });
    return store;
  } catch (error) {
    return null;
  }
};

// GET ALL STORES
export const getAllStores = async () => {
  try {
    const stores = await db.store.findMany();
    return stores;
  } catch (error) {
    return null;
  }
};

// GET ALL STORES (USER)
export const getAllStoresByUserId = async (userId: string) => {
  try {
    const stores = await db.store.findMany({ where: { user_id: userId } });
    return stores;
  } catch (error) {
    return null;
  }
};

// DELETE STORE
export const deleteStore = async (id: string) => {
  try {
    await db.store.delete({ where: { id } });
  } catch (error) {
    return false;
  }
};

// UPDATE STORE
export const updateStore = async (id: string, data: Store) => {
  try {
    const store = await db.store.update({ where: { id }, data });
    return store;
  } catch (error) {
    return null;
  }
};
