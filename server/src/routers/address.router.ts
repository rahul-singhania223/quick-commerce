import { Router } from "express";
import { authorizeUser } from "../middleware/auth.middleware.js";
import { validateForm } from "../middleware/validate.middleware.js";
import { createAddressSchema } from "../schemas/address.schema.js";
import { createAddress, deleteAddress, getAddressById, getAllAddressesByUser } from "../controllers/address.controller.js";

const router = Router();

// create address
router.post(
  "/",
  authorizeUser,
  validateForm(createAddressSchema),
  createAddress,
);

// get all addresses
router.get("/", authorizeUser, getAllAddressesByUser);

// get address by id
router.get("/:id", authorizeUser, getAddressById);



// delete address by id
router.delete("/:id", authorizeUser, deleteAddress);

export default router;
