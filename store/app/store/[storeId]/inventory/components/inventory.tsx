"use client";

import api from "@/config/api.config";
import { inventoryQuery } from "@/quries/inventory.query";
import { Inventory as InventoryType, StoreProduct } from "@/types/types";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { columns } from "./inventory-column";
import { DataTable } from "./data-table";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { any } from "zod";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Box,
  ChevronDown,
  Edit2,
  Loader2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useInventoryStore } from "@/zustand-store/inventory.store";
import PageLoader from "@/components/page-loader";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Wrapper from "@/components/wrapper";
import { productQuery } from "@/quries/product.query";

interface InventoryItemProps {
  item: StoreProduct;
}

function InventoryItem({ item }: InventoryItemProps) {
  const { upsertInventory, removeInventory, getInventoryById } =
    useInventoryStore();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const [deleting, setDeleting] = useState(false);

  const deleteInventory = async () => {
    try {
      setDeleting(true);
      const res = await productQuery.deleteInventory(
        item.store_id as string,
        item.id
      );
      toast.success("Inventory deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Couldn't delete inventory!");
    } finally {
      setDeleting(false);
    }
  };

  const syncDbInventory = async (qty: number) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await inventoryQuery.updateInventory(
          item.store_id as string,
          item.inventory.id,
          { stock_quantity: qty }
        );
      } catch (error) {
        console.log(error);
        toast.error("Couldn't sync inventory!");
      }
    }, 600);
  };

  const updateInventoryQty = async (qty: number) => {
    const inventoryItem = getInventoryById(item.id);
    if (!inventoryItem) return;
    inventoryItem.inventory.stock_quantity = qty;

    upsertInventory(inventoryItem);

    syncDbInventory(qty);
  };

  return (
    <div className="border-b pb-4 mb-10 hover:bg-muted p-4 rounded-lg">
      <div className="flex items-center overflow-hidden gap-2">
        {/* Left section */}
        <div className="flex flex-1 min-w-0 items-center">
          <Image
            className="w-12 h-12 object-contain mr-2 shrink-0"
            src={item.variant?.image || "/images/logo.png"}
            alt="product-image"
            width={100}
            height={100}
          />
          <h3 className="text-base lg:text-xl font-medium truncate">
            {item.variant?.product?.name}
          </h3>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-5 shrink-0 ml-6">
          <span className="text-lg font-bold">₹{item.selling_price}</span>
          <div
            className={cn(
              "text-base font-medium w-16 h-8 bg-green-300 flex items-center justify-center rounded-lg",
              {
                "bg-red-300":
                  item.inventory.stock_quantity <=
                  item.inventory.low_stock_alert,
              }
            )}
          >
            {item.inventory.stock_quantity}
          </div>
        </div>
      </div>
      <div className="text-sm mt-3">
        <div className="font-medium">
          <span className="text-muted-foreground mr-2">Discount:</span>
          {item.discount_percent}%
        </div>
        <div className="font-medium">
          <span className="text-muted-foreground mr-2">MRP:</span>₹
          {item.variant?.mrp}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 mt-3 lg:justify-end">
        <Button
          disabled={item.inventory.stock_quantity === 10_000}
          onClick={() => updateInventoryQty(item.inventory.stock_quantity + 1)}
          variant={"outline"}
          size={"sm"}
          className="flex-1 max-w-40 lg:h-11"
        >
          <Plus className="size-4.5" />
        </Button>
        <Button
          disabled={item.inventory.stock_quantity === 10_000}
          onClick={() => updateInventoryQty(item.inventory.stock_quantity - 1)}
          variant={"outline"}
          size={"sm"}
          className="flex-1 max-w-40 lg:h-11"
        >
          <Minus className="size-4.5" />
        </Button>
        <Button
          onClick={() => router.push(pathname + "/update/" + item.inventory.id)}
          variant={"outline"}
          size={"sm"}
          className="flex-1 max-w-40 lg:h-11"
        >
          <Edit2 className="size-4.5" />
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className="text-destructive flex-1 max-w-40 lg:h-11"
        >
          <Trash2 className="size-4.5" />
        </Button>
      </div>
    </div>
  );
}

export default function Inventory() {
  const params = useParams();
  const { storeId } = params;

  const [loading, setLoading] = useState(true);
  const [filteredInventory, setFilteredInventory] = useState<StoreProduct[]>(
    []
  );

  const { inventory, setInventory } = useInventoryStore();

  const router = useRouter();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await inventoryQuery.getStoreInventory(storeId as string);
        setInventory(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Couldn't fetch inventory!");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [storeId]);

  useEffect(() => {
    if (inventory.size > 0) {
      setFilteredInventory(Array.from(inventory.values()));
    }
  }, [inventory]);

  if (loading) return <PageLoader />;

  if (inventory.size === 0) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="-mt-20">
          <Box className="size-20 text-muted-foreground mb-4" />
          <h1 className="text-2xl text-foreground font-bold mb-3 tracking-tight">
            No products!
          </h1>
          <p className="text-gray-500 max-w-70 leading-relaxed">
            Add products to your store so customers can start ordering.
          </p>
          <Button
            onClick={() => router.push(`/${storeId}/inventory/add`)}
            className="text-lg font-medium h-12 mt-6 w-full max-w-xs"
          >
            <Plus className="size-5" /> Add First Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Wrapper className="mx-auto">
      <div className="p-0 lg:p-6 mt-5 lg:m-0 pb-10">
        <div className="w-full bg-white shadow rounded-lg p-2">
          <div className="p-2 text-lg font-semibold border-b">
            {inventory.size} Items
          </div>
          {filteredInventory.map((item) => (
            <>
              <InventoryItem item={item} key={item.id} />
            </>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
