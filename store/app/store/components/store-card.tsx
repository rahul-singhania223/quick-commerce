"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Store } from "@/types/types";
import { MapPin, Pin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface StoreProps {
  store: Store;
}

export default function StoreCard({ store }: StoreProps) {
  const router = useRouter();

  return (
    <div className="bg-white border rounded-2xl p-4 min-h-40 cursor-pointer hover:border-primary shadow-xs">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <Image
              className="w-16 h-16 object-contain"
              src={store.logo}
              alt="store-logo"
              width={200}
              height={200}
            />
            <h3 className="text-lg lg:text-[16px] font-semibold text-no-wrap text-ellipsis">
              {store.name}
            </h3>
          </div>
          <div className="text-[13px] text-[#6B7280] mt-1 text-nowrap text-ellipsis">
            <MapPin className="size-3.5" /> {store.address}
          </div>
        </div>
        <div className="text-sm lg:text-[12px] flex h-fit items-center">
          <div
            className={cn("size-2.5 bg-[#10B981] mr-1.5 rounded-full", {
              "bg-[#EF4444]": store.status === "CLOSED",
            })}
          />
          <span>{store.status === "OPEN" ? "Online" : "Offline"}</span>
        </div>
      </div>

      <Button
        onClick={() => router.push(`/store/${store.id}`)}
        className="h-12 w-full bg-[#F3F4F6] text-[14px] font-semibold rounded-xl hover:bg-primary/20 text-foreground cursor-pointer mt-6"
      >
        Open Dashboard
      </Button>
    </div>
  );
}
