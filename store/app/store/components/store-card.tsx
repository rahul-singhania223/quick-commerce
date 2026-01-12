"use client";

import { Button } from "@/components/ui/button";
import { Store } from "@/types/types";
import { MapPin, Pin } from "lucide-react";
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
          <h3 className="text-[16px] font-semibold text-no-wrap text-ellipsis">
            {store.name}
          </h3>
          <div className="text-[13px] text-[#6B7280] mt-1 text-nowrap text-ellipsis">
            <MapPin className="size-3.5" /> {store.address}
          </div>
        </div>
        <div className="text-[12px] flex h-fit items-center">
          <div className="size-2.5 bg-[#10B981] mr-1.5 rounded-full" />{" "}
          <span>{store.status === "OPEN" ? "Online" : "Offline"}</span>
        </div>
      </div>

      <Button
        onClick={() => router.push(`/${store.id}`)}
        className="h-11 w-full bg-[#F3F4F6] text-[14px] font-semibold rounded-xl hover:bg-primary/20 text-foreground cursor-pointer mt-6"
      >
        Open Dashboard
      </Button>
    </div>
  );
}
