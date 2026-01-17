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
import { useRouter } from "next/navigation";
import { useCurrentStore } from "@/zustand-store/currentStore.store";
import { useEffect } from "react";
import { storeQuery } from "@/quries/store.query";
import PageLoader from "@/components/page-loader";
import { validate as isValidUUID } from "uuid";
import { Store } from "@/types/types";

interface Props {
  // storeId: string;
}

export function Navbar({}: Props) {
  const params = useParams();
  const { storeId } = params;

  const { stores, setStores, isLoading, setLoading } = useUserStore();
  const { store, setStore } = useCurrentStore();

  const router = useRouter();

  useEffect(() => {
    if (stores) return;

    const fetchAllStores = async () => {
      try {
        setLoading(true);
        const res = await storeQuery.getStores();
        setStores(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStores();
  }, [storeId, stores]);

  useEffect(() => {
    if (!isValidUUID(storeId)) return router.back();
    if (!stores || stores.length === 0) return;
    if (store) return;

    const selectedStore = stores.find((store: Store) => store.id === storeId);

    if (selectedStore) {
      setStore(selectedStore);
    }
  }, [storeId, store, stores]);

  if (isLoading) return <PageLoader />;
  if (!stores) return null;
  if (!store) return null;

  return (
    <nav className="grid grid-cols-2 border-b border-border px-3 lg:px-6 h-16 bg-white">
      {/* Left section - Store name and status */}
      <div className="flex items-center lg:gap-6">
        <StoreChanger selectedStore={store} stores={stores}>
          <div className="flex items-center gap-2">
            <Image
              className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg"
              src={store.logo}
              alt="logo"
              width={200}
              height={200}
            />
            {store.name}
          </div>
        </StoreChanger>
        <OnlineToggler selectedStore={store} />

        <Sidebar>
          <PanelLeft className="hidden lg:inline" />
        </Sidebar>
      </div>

      {/* Right section - Action icons */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => router.push(location.pathname + "/settings")}
          className="relative hidden lg:flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
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
