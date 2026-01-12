import { includes } from "zod/v4";
import db from "../configs/db.config.ts";
import { Inventory, Prisma } from "../generated/prisma/client.ts";

// update inventory
export const updateInventory = async (
  id: string,
  data: Prisma.InventoryUpdateInput
) => {
  try {
    const inventory = await db.inventory.update({ where: { id }, data });
    return inventory;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get inventory
export const getInventory = async (id: string) => {
  try {
    const inventory = await db.inventory.findUnique({
      where: { id },
      include: {
        store_product: {
          select: {
            discount_percent: true,
            selling_price: true,
            is_listed: true,
            is_available: true,
            store_id: true,
            variant_id: true,
            variant: {
              select: {
                id: true,
                mrp: true,
                name: true,
                image: true,
                product: {
                  select: {
                    name: true,
                    category: {
                      select: {
                        name: true,
                      },
                    },
                    brand: {
                      select: {
                        name: true,
                      },
                    },
                    variants: {
                      select: {
                        id: true,
                        mrp: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return inventory;
  } catch (error) {
    return null;
  }
};

// create inventory
export const createInventory = async (data: Inventory) => {
  try {
    const inventory = await db.inventory.create({ data });
    return inventory;
  } catch (error) {
    return null;
  }
};

// get all store inventory
export const getStoreInventory = async (storeId: string) => {
  try {
    // TODO: fix
    
    // const inventory = await db.inventory.findMany({
    //   where: { store_id: storeId },
    //   include: {
    //     store_product: {
    //       select: {
    //         discount_percent: true,
    //         selling_price: true,
    //         is_listed: true,
    //         is_available: true,
    //         store_id: true,
    //         variant: {
    //           select: {
    //             mrp: true,
    //             name: true,
    //             image: true,
    //             product: {
    //               select: {
    //                 name: true,
    //                 category: {
    //                   select: {
    //                     name: true,
    //                   },
    //                 },
    //                 brand: {
    //                   select: {
    //                     name: true,
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    return null;
  } catch (error) {
    return null;
  }
};
