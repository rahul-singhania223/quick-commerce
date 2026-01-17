"use client";

import { useParams, useRouter } from "next/navigation";
import InventoryForm from "../../add/components/inventory-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Inventory } from "@/types/types";
import { inventoryQuery } from "@/quries/inventory.query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/page-loader";
import PageNav from "@/components/page-nav";

export default function PageComponent() {
  const { inventoryId, storeId } = useParams();

  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState<Inventory>();

  const router = useRouter();

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

  if (loading) return <PageLoader />;

  return (
    <div className="pt-16">
      <PageNav title="Update Inventory" />
      <InventoryForm data={inventoryData} />
    </div>
  );
}
