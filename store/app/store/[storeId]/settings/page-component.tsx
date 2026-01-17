"use client";

import PageLoader from "@/components/page-loader";
import PageNav from "@/components/page-nav";
import { cn } from "@/lib/utils";
import { storeQuery } from "@/quries/store.query";
import { useCurrentStore } from "@/zustand-store/currentStore.store";
import { Images } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function PageComponent() {
  const { store, setStore, isLoading, setLoading } = useCurrentStore();

  const params = useParams();
  const { storeId } = params;

  useEffect(() => {
    if (!storeId) return;
    if (store) return;
    const fetchStore = async () => {
      try {
        setLoading(true);
        const res = await storeQuery.getStore(storeId as string);
        setStore(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId, store]);

  if (isLoading) return <PageLoader />;
  if (!store) return null;

  return (
    <div className="font-sans bg-white">
      {/* NAVBAR */}
      <PageNav title="Store Profile" />

      <div className="pt-14">
        {/* STORE CARD */}
        <div className="m-4 p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0">
            <Image
              src={store.logo}
              alt="store-log"
              width={200}
              height={200}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1">
            <div className="text-[15px] font-semibold text-gray-900 leading-5">
              {store.name}
            </div>

            <span
              className={cn(
                "inline-block mt-1 py-0.5 px-2 rounded-lg text-xs capitalize!",
                {
                  "bg-green-100 text-green-800": store.status === "OPEN",
                  "bg-red-100 text-red-800": store.status === "CLOSED",
                }
              )}
            >
              {store.status.toLowerCase()}
            </span>
          </div>
        </div>

        {/* STORE DETAILS */}
        <div className="my-4 space-y-3">
          <Detail label="Owner Name" value={store.owner_name} />
          <Detail label="Phone Number" value={store.phone} />
          <Detail label="Store Address" value={store.address} />
          {store.Zone && (
            <Detail label="Service Area" value={store.Zone.name} />
          )}
          <Detail
            label="Joined On"
            value={new Date(store.created_at).toLocaleDateString("en-US")}
          />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-0 border-b border-gray-200 flex flex-col gap-1">
      <span className="text-[12px] text-[#6B7280]">{label}</span>
      <span className="text-[#111827] text-[14px]] font-medium leading-6">
        {value}
      </span>
    </div>
  );
}
