"use client";

import { Button } from "@/components/ui/button";
import Header from "./header";
import { Loader2, Plus, Store as StoreIcon } from "lucide-react";
import StoreCard from "./store-card";
import { useUserStore } from "@/zustand-store/userStores.store";
import { useEffect, useRef, useState } from "react";
import { storeQuery } from "@/quries/store.query";
import { Store } from "@/types/types";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/page-loader";

export function PageComponent() {
  const router = useRouter();

  const { stores, setStores, isLoading, setLoading } = useUserStore();

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
  }, [stores]);

  if (isLoading) return <PageLoader />;
  if (!stores) return null;

  return (
    <>
      <div>
        <Header />

        {stores.length === 0 && (
          <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center p-8">
            <div className="">
              <StoreIcon className="size-16 text-[#9CA3AF] mb-4" />
              <h1 className="text-[20px] font-semibold">No stores yet!</h1>
              <p className="text-[14px] text-body mt-2 max-w-90">
                Create your first store to start receiving orders.
              </p>

              <Button
                onClick={() => router.push("/store/create")}
                className="h-12 px-6 text-white text-[16px] font-semibold rounded-xl mt-6 cursor-pointer active:95"
              >
                Create Your First Store
              </Button>

              <div className="bg-[#EFF6FF] text-[#1D4ED8] text-[13px] py-3 px-4 rounded-xl my-4 mt-8 mx-6">
                &#8505; You can manage up to 5 stores from one account.
              </div>
            </div>
          </div>
        )}

        {stores.length > 0 && (
          <>
            <div className="p-6 border-b">
              <h1 className="text-[22px] font-bold">Your Stores</h1>
              <p className="text-[14px] text-body mt-1">
                Manage your stores or create a new one.
              </p>

              <Button
                onClick={() => router.push("/store/create")}
                className="h-11 px-4 text-white text-[14px] font-semibold rounded-[10px] disabled:cursor-not-allowed mt-6"
              >
                <Plus className="size-4" /> Create New Store
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
