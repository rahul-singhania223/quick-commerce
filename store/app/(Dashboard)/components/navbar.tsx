"use client";

import { Bell, PanelLeft, Settings } from "lucide-react";
import { StoreChanger } from "./store-changer";
import { useUserStore } from "@/zustand-store/userStores.store";
import { Button } from "@/components/ui/button";
import { OnlineToggler } from "./online-toggler";
import { cn } from "@/lib/utils";
import NavStats from "./nav-stats";
import Image from "next/image";
import { Sidebar } from "./sidebar";
import { useParams } from "next/navigation";

interface Props {
  // storeId: string;
}

export function Navbar({}: Props) {
  const params = useParams();
  const { storeId: selectedStoreId } = params;

  const { stores } = useUserStore();

  const selectedStore = stores.find((store) => store.id === selectedStoreId);

  if (!selectedStore) return null;

  return (
    <nav className="grid grid-cols-3 border-b border-border px-6 h-16 bg-white">
      {/* Left section - Store name and status */}
      <div className="flex items-center gap-6">
        <StoreChanger selectedStore={selectedStore} stores={stores}>
          <div className="flex items-center gap-2">
            <Image
              className="w-12 h-12 rounded-lg"
              src={selectedStore.logo}
              alt="logo"
              width={200}
              height={200}
            />
            {selectedStore.name}
          </div>
        </StoreChanger>
        <OnlineToggler selectedStore={selectedStore}>
          
        </OnlineToggler>
        <Sidebar>
          <PanelLeft />
        </Sidebar>
      </div>

      {/* Center-right section - Revenue */}
      <div className="flex justify-center items-center">
        {/* <NavStats /> */}
      </div>

      {/* Right section - Action icons */}
      <div className="flex items-center justify-end gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </nav>
  );
}
