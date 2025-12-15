import db from "../configs/db.config.ts";
import { Store } from "../generated/prisma/client.ts";

// CREATE STORE
export const createStore = async (data: Store) => {
  try {
    const store = db.store.create({ data });
    return store;
  } catch (error) {
    return null;
  }
};

// GET STORE
export const getStore = async (id: string) => {
  try {
    const store = db.store.findUnique({ where: { id } });
    return store;
  } catch (error) {
    return null;
  }
};

// GET ALL STORES
export const getAllStores = async (userId: string) => {
  try {
    const stores = db.store.findMany({ where: { userId } });
    return stores;
  } catch (error) {
    return null;
  }
};


// GET ALL STORES (USER)
export const getAllStoresByUserId = async (userId: string) => {
  try {
    const stores = db.store.findMany({ where: { user_id: userId } });
    return stores;
  } catch (error) {
    return null;
  }
};