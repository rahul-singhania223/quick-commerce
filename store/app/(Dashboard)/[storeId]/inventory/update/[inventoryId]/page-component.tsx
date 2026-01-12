"use client";

import { useParams } from "next/navigation";
import InventoryForm from "../../add/components/inventory-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Inventory } from "@/types/types";
import { inventoryQuery } from "@/quries/inventory.query";
import { toast } from "sonner";

export default function PageComponent() {
  const { inventoryId, storeId } = useParams();

  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState<Inventory>();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await inventoryQuery.getInventoryById(
          storeId as string,
          inventoryId as string
        );
        setInventoryData(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Couldn't fetch inventory!");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [inventoryId, storeId]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="animate-spin size-5 text-muted-foreground" />
      </div>
    );

  return (
    <div>
      <div className="p-4 px-6 bg-white">
        <h1 className="text-2xl font-semibold">
          <ChevronLeft className="inline size-6" />
          Update Inventory
        </h1>
      </div>
      <InventoryForm data={inventoryData} />
    </div>
  );
}
