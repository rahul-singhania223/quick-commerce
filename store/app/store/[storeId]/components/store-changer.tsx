"use client";

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
import { ArrowUpDown, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { Store } from "@/types/types";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  stores: Store[];
  selectedStore: Store;
}

export function StoreChanger({ children, stores, selectedStore }: Props) {
  const router = useRouter();

  const changeStore = (storeId: string) => {
    router.push(`/${storeId}`);
  };

  return (
    <Select
      defaultValue={selectedStore.id}
      onValueChange={(value) => changeStore(value)}
    >
      <SelectTrigger
        className="border-none shadow-none min-w-fit px-1 text-lg font-medium hover:bg-muted h-[calc(100%-10px)]!"
        icon={<ChevronsUpDown className="size-3" />}
      >
        {children}
      </SelectTrigger>
      <SelectContent position="popper">
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            <div className="flex items-center justify-between gap-8">
              <div>
                <h4 className="text-base font-semibold">{store.name}</h4>
                <p className="text-muted-foreground text-nowrap text-ellipsis text-sm">
                  {store.address}
                </p>
              </div>
              <Image
                className="w-12 h-12 object-contain rounded-lg"
                src={store.logo}
                width={200}
                height={200}
                alt="store-image "
              />
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
