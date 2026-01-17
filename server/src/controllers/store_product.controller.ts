import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/async-handler.js";
import { APIResponse } from "../utils/api-response.util.js";
import { v4, validate as isValidUUID } from "uuid";
import { ApiError } from "../utils/api-error.js";
import { createStoreProductSchema } from "../schemas/store_product.schema.js";
import z from "zod";
import {
  Inventory,
  Prisma,
  ProductVariant,
  StoreProduct,
} from "../generated/prisma/client.js";
import {
  createStoreProduct as createDbStoreProduct,
  getAllStoreProducts as fetchAllStoreProducts,
  getStoreProduct as fetchStoreProduct,
  updateStoreProduct as updateDbStoreProduct,
  getStoreProductWithVariantAndStore as fetchStoreProductWithVariantAndStore,
  deleteStoreProduct as deleteDbStoreProduct,
} from "../models/store_product.model.js";

import { getProductVariant as fetchProductVariant } from "../models/product_variant.model.js";

import {
  createInventory as createDbInventory,
  updateInventory as updateDbInventory,
  getInventory as fetchInventory,
} from "../models/inventory.model.js";

// GET ALL STORE PRODUCTS BY STORE ID
export const getAllStoreProductsByStore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = req.params.storeId;
    if (!storeId || !isValidUUID(storeId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid store ID!"));

    const storeProducts = await fetchAllStoreProducts({ store_id: storeId });
    if (!storeProducts)
      return next(
        new ApiError(404, "DB_ERROR", "Couldn't get store products!")
      );

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Store products fetched successfully!",
          storeProducts
        )
      );
  }
);

// GET ALL STORE PRODUCTS
export const getAllStoreProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Add pagination

    const storeProducts = await fetchAllStoreProducts();
    if (!storeProducts)
      return next(
        new ApiError(404, "DB_ERROR", "Couldn't get store products!")
      );

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Store products fetched successfully!",
          storeProducts
        )
      );
  }
);

// GET STORE PRODUCT
export const getStoreProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id || !isValidUUID(id))
      return next(new ApiError(400, "INVALID_DATA", "Invalid product ID!"));

    const storeProduct = await fetchStoreProduct(id);
    if (!storeProduct)
      return next(new ApiError(404, "DB_ERROR", "Couldn't get store product!"));

    return res
      .status(200)
      .json(
        new APIResponse(
          "success",
          "Store product fetched successfully!",
          storeProduct
        )
      );
  }
);

// CREATE STORE PRODUCT
export const createStoreProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as z.infer<typeof createStoreProductSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    const { storeProduct, inventory } = data;

    const store = req.store;
    if (!store) return next(new ApiError(404, "NOT_FOUND", "Store not found!"));

    // product variant exists
    const existingProductVariant = await fetchProductVariant({
      id: storeProduct.variant_id,
    });
    if (!existingProductVariant)
      return next(new ApiError(400, "DB_ERROR", "Product variant not found!"));

    // product variant is active
    if (!existingProductVariant.is_active)
      return next(
        new ApiError(400, "DB_ERROR", "Product variant is not active!")
      );

    // selling price is valid
    if (storeProduct.selling_price > Number(existingProductVariant.mrp))
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "Selling price cannot be greater than MRP " +
            existingProductVariant.mrp
        )
      );

    // discount percent is valid
    if (storeProduct.discount_percent >= 100)
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "Discount percent must be less than 100%"
        )
      );

    // store is already selling this product variant
    const existingStoreProduct = await fetchStoreProductWithVariantAndStore({
      variant_id: storeProduct.variant_id,
      store_id: store.id,
    });
    if (existingStoreProduct)
      return next(
        new ApiError(400, "DB_ERROR", "Store is already selling this product!")
      );

    // check stock quantity
    if (inventory.stock_quantity < 1)
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "Stock quantity must be greater than 0"
        )
      );

    if (inventory.stock_quantity < inventory.low_stock_alert)
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "Stock quantity must be greater than low stock alert!"
        )
      );

    // create store product
    const newStoreProductData: StoreProduct = {
      id: v4(),
      variant_id: storeProduct.variant_id,
      store_id: store.id,
      selling_price: new Prisma.Decimal(storeProduct.selling_price),
      discount_percent: new Prisma.Decimal(storeProduct.discount_percent),
      is_listed: storeProduct.is_listed,
      is_available: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newStoreProduct = await createDbStoreProduct(newStoreProductData);
    if (!newStoreProduct)
      return next(
        new ApiError(500, "DB_ERROR", "Couldn't create store product!")
      );

    // create inventor
    const newInventoryData: Inventory = {
      id: v4(),
      store_product_id: newStoreProduct.id,
      stock_quantity: inventory.stock_quantity,
      low_stock_alert: inventory.low_stock_alert,
      reserved_quantity: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newInventory = await createDbInventory(newInventoryData);
    if (!newInventory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't create inventory!"));

    return res.status(201).json(
      new APIResponse("success", "Store product created successfully!", {
        ...newStoreProduct,
        inventory: newInventory,
      })
    );
  }
);

// UPDATE STORE PRODUCT
export const updateStoreProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeProductId = req.params.storeProductId;
    const inventoryId = req.params.inventoryId;

    if (!storeProductId || !isValidUUID(storeProductId))
      return next(
        new ApiError(400, "INVALID_DATA", "Invalid store product ID!")
      );

    if (!inventoryId || !isValidUUID(inventoryId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid inventory ID!"));

    const data = req.body as z.infer<typeof createStoreProductSchema>;
    if (!data)
      return next(
        new ApiError(400, "INVALID_DATA", "All input fields are required!")
      );

    // store product exists
    const storeProduct = await fetchStoreProduct(storeProductId);
    if (!storeProduct)
      return next(new ApiError(404, "DB_ERROR", "Store product not found!"));

    // inventory exists
    const inventory = await fetchInventory(inventoryId);
    if (!inventory)
      return next(new ApiError(404, "DB_ERROR", "Inventory not found!"));

    // product variant
    let productVariant: ProductVariant | null;

    if (data.storeProduct.variant_id) {
      productVariant = await fetchProductVariant({
        id: data.storeProduct.variant_id,
      });
      if (!productVariant)
        return next(
          new ApiError(404, "DB_ERROR", "Product variant not found!")
        );
    } else {
      productVariant = await fetchProductVariant({
        id: storeProduct.variant_id,
      });
      if (!productVariant)
        return next(
          new ApiError(404, "DB_ERROR", "Product variant not found!")
        );
    }

    // selling price is valid
    if (
      data.storeProduct.selling_price &&
      Number(data.storeProduct.selling_price) > Number(productVariant.mrp)
    )
      return next(
        new ApiError(
          400,
          "INVALID_DATA",
          "Selling price cannot be greater than MRP " + productVariant.mrp
        )
      );

    // discount is valid
    if (
      data.storeProduct.discount_percent &&
      Number(data.storeProduct.discount_percent) >= 100
    )
      return next(
        new ApiError(400, "INVALID_DATA", "Discount must be less than 100%")
      );

    const updateStoreProductData: Prisma.StoreProductUpdateInput = {
      ...storeProduct,
      selling_price: data.storeProduct.selling_price
        ? new Prisma.Decimal(data.storeProduct.selling_price)
        : storeProduct.selling_price,
      discount_percent: data.storeProduct.discount_percent
        ? new Prisma.Decimal(data.storeProduct.discount_percent)
        : storeProduct.discount_percent,
      updated_at: new Date(),
    };

    const updatedStoreProduct: StoreProduct | null = await updateDbStoreProduct(
      storeProduct.id,
      updateStoreProductData
    );
    if (!updatedStoreProduct)
      return next(
        new ApiError(500, "DB_ERROR", "Couldn't update store product!")
      );

    const updatedInventory = await updateDbInventory(inventory.id, {
      stock_quantity: data.inventory.stock_quantity,
      low_stock_alert: data.inventory.low_stock_alert,
      updated_at: new Date(),
    });
    if (!updatedInventory)
      return next(new ApiError(500, "DB_ERROR", "Couldn't update inventory!"));

    return res.status(200).json(
      new APIResponse("success", "Store product updated successfully!", {
        storeProduct: updateStoreProduct,
        inventory: updatedInventory,
      })
    );
  }
);

// DELETE STORE PRODUCT
export const deleteStoreProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeProductId = req.params.storeProductId;
    if (!storeProductId || !isValidUUID(storeProductId))
      return next(new ApiError(400, "INVALID_DATA", "Invalid product ID!"));

    const existingStoreProduct: StoreProduct | null = await fetchStoreProduct(
      storeProductId
    );
    if (!existingStoreProduct)
      return next(new ApiError(404, "DB_ERROR", "Store product not found!"));

    const deletedStoreProduct = await deleteDbStoreProduct(
      existingStoreProduct.id
    );
    if (!deletedStoreProduct)
      return next(
        new ApiError(500, "DB_ERROR", "Couldn't delete store product!")
      );

    return res
      .status(200)
      .json(new APIResponse("success", "Store product deleted successfully!"));
  }
);
