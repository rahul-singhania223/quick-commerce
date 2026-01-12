"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { inventoryQuery } from "@/quries/inventory.query";
import { Inventory } from "@/types/types";
import { useInventoryStore } from "@/zustand-store/inventory.store";
import { ColumnDef } from "@tanstack/react-table";
import {
  IndianRupee,
  Loader2,
  Minus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import InventoryPage from "../page";
import { usePathname, useRouter } from "next/navigation";
import { productQuery } from "@/quries/product.query";

export const columns: ColumnDef<Inventory>[] = [
  {
    id: "image",
    cell: ({ row }) => {
      const imageUrl = row.original.store_product?.variant?.image;
      if (!imageUrl) return null;
      return (
        <Image
          className="w-10 h-10 object-contain block mx-auto"
          src={imageUrl}
          width={200}
          height={200}
          alt="variant-image"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const productName = row.original.store_product?.variant?.product?.name;

      return (
        <div className="flex flex-col">
          <h3 className="text-[14px] leading-4.5 truncate text-ellipsis text-base!">
            {productName}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const mrp = row.original.store_product?.variant?.mrp;

      return (
        <div className="flex flex-col">
          <h3 className="text-[14px] leading-4.5 truncate text-ellipsis text-base!">
            ₹{mrp}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const sellingPrice = row.original.store_product?.selling_price;

      return (
        <div className="flex flex-col">
          <h3 className="text-[14px] leading-4.5 truncate text-ellipsis text-base!">
            ₹{sellingPrice}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      const discount = row.original.store_product?.discount_percent;

      return (
        <div className="flex flex-col">
          <h3 className="text-[14px] leading-4.5 truncate text-ellipsis text-base!">
            {discount}%
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock_quantity;
      const isOutOfStock = stock <= row.original.low_stock_alert;

      useEffect(() => {
        console.log(stock);
      }, [row.original]);

      return (
        <div className="flex flex-col">
          <span
            className={cn(
              "p-1 px-3 w-16 rounded-full text-white text-base font-medium leading-4.5 text-center",
              isOutOfStock ? "bg-red-300" : "bg-green-400"
            )}
          >
            {stock}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { upsertInventory } = useInventoryStore();
      const [deleting, setDeleting] = useState(false);
      const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
      const router = useRouter();
      const pathname = usePathname();

      const stock = row.original.stock_quantity;
      const inventoryData = row.original;

      const updateInventory = async () => {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }

        syncTimeoutRef.current = setTimeout(async () => {
          try {
            const res = await inventoryQuery.updateInventory(
              inventoryData.store_product?.store_id as string,
              inventoryData.id,
              { stock_quantity: row.original.stock_quantity }
            );
          } catch (error) {
            console.log(error);
            toast.error("Couldn't sync inventory!");
          }
        }, 600);
      };

      const increaseInventory = async () => {
        inventoryData.stock_quantity = stock + 1;

        // UI update
        upsertInventory(inventoryData);

        // DB update
        updateInventory();
      };

      const decreaseInventory = async () => {
        inventoryData.stock_quantity = stock - 1;

        // UI update
        upsertInventory(inventoryData);

        // DB update
        updateInventory();
      };

      const deleteInventory = async () => {
        try {
          setDeleting(true);
          const res = await productQuery.deleteInventory(
            inventoryData.store_product?.store_id as string,
            inventoryData.store_product_id
          );
          toast.success("Inventory deleted successfully!");
        } catch (error) {
          console.log(error);
          toast.error("Couldn't delete inventory!");
        } finally {
          setDeleting(false);
        }
      };

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant={"outline"}
            onClick={increaseInventory}
            className="text-xs font-medium cursor-pointer"
          >
            <Plus className="size-5" />
          </Button>

          <Button
            variant={"outline"}
            onClick={decreaseInventory}
            className="text-xs font-medium cursor-pointer"
          >
            <Minus className="size-5" />
          </Button>
          <Button
            onClick={() =>
              router.push(pathname + "/update/" + inventoryData.id)
            }
            variant={"outline"}
            className="text-xs font-medium cursor-pointer"
          >
            <Pencil className="size-5" />
          </Button>
          <Button
            disabled={deleting}
            variant={"destructive"}
            onClick={deleteInventory}
            className="text-xs font-medium cursor-pointer"
          >
            {deleting ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <Trash2 className="size-5" />
            )}
          </Button>
        </div>
      );
    },
  },
];
