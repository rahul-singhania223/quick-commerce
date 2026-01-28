import db from "../configs/db.config.js";
import { Prisma } from "../generated/prisma/client.js";

// create address
export const createAddress = async (data: Prisma.AddressCreateInput) => {
  try {
    const address = await db.address.create({ data });
    return address;
  } catch (error) {
    console.log(error);
    return null;
  }
};


// get address by id
export const getAddressById = async (id: string) => {
  try {
    const address = await db.address.findUnique({ where: { id } });
    return address;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// delete address by id
export const deleteAddress = async (id: string) => {
  try {
    const address = await db.address.delete({ where: { id } });
    return address;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get address by user and id
export const getAddressByUserAndId = async ({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) => {
  try {
    const address = await db.address.findFirst({
      where: { id, userId },
    });
    return address;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get all addresses by user
export const getAllAddressesByUser = async (userId: string) => {
  try {
    const addresses = await db.address.findMany({ where: { userId } });
    return addresses;
  } catch (error) {
    console.log(error);
    return null;
  }
};