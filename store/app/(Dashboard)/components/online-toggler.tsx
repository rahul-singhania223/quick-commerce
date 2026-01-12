import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsUpDown } from "lucide-react";
import { Store, Store_Status, SuccessResponse } from "@/types/types";
import { storeQuery } from "@/quries/store.query";
import { useUserStore } from "@/zustand-store/userStores.store";
import { toast } from "sonner";

interface Props {
  // children: React.ReactNode;
  selectedStore: Store;
}

export function OnlineToggler({ selectedStore }: Props) {
  const { setStores, stores } = useUserStore();

  console.log(selectedStore);

  const changeStoreMode = async (value: Store_Status) => {
    try {
      const updatedStore: Store = {
        ...selectedStore,
        fssai: selectedStore.fssai ? selectedStore.fssai : undefined,
        latitude: Number(selectedStore.latitude),
        longitude: Number(selectedStore.longitude),
        status: value,
      };

      const updatedStores = stores.map((store) => {
        if (store.id === selectedStore.id) {
          return updatedStore;
        }
        return store;
      });

      setStores(updatedStores);

      const res = await storeQuery.updateStore(selectedStore.id, updatedStore);

      if (value === "OPEN") {
        toast.success("Store is now OPEN", {
          richColors: true,
          style: { color: "green" },
        });
      } else {
        toast.success("Store is now CLOSED", {
          richColors: true,
          style: { color: "red" },
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to change store status!");
    }
  };

  const initialStoreStatus =
    selectedStore.status === "OPEN" ? "OPEN" : "CLOSED";

  return (
    <Select
      defaultValue={initialStoreStatus}
      onValueChange={(value: Store_Status) => changeStoreMode(value)}
    >
      <SelectTrigger
        icon={<ChevronsUpDown />}
        className="w-32 border-none shadow-none hover:bg-muted"
      >
        <SelectValue className="w-full space-x-1 uppercase" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="OPEN" className="space-x-1">
          <div className="size-2.5 bg-green-500 rounded-full" />
          <span className="text-base text-body font-medium">Online</span>
        </SelectItem>
        <SelectItem value="CLOSED" className="space-x-1">
          <div className="size-2.5 bg-red-500 rounded-full" />
          <span className="text-base text-body font-medium">Offline</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
