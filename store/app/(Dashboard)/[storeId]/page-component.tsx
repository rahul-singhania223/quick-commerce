"use client";

import { Loader2 } from "lucide-react";
import { Navbar } from "../components/navbar";
import { storeQuery } from "@/quries/store.query";
import { Store } from "@/types/types";
import { useUserStore } from "@/zustand-store/userStores.store";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  storeId: string;
}

export default function PageComponent({ storeId }: Props) {
  const [loading, setLoading] = useState(true);

  const getStoreReqCount = useRef(0);

  const { stores, setStores } = useUserStore();

  useEffect(() => {
    if (stores.length > 0) return;
    getStoreReqCount.current = 0;

    const getStores = async () => {
      getStoreReqCount.current++;
      try {
        setLoading(true);
        const res = await storeQuery.getStores();
        setStores(res.data.data as Store[]);
      } catch (error) {
        console.log(error);
        if (getStoreReqCount.current < 3) getStores();
      } finally {
        setLoading(false);
      }
    };

    getStores();
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin" />
      </div>
    );
  return (
    <div>
      <Navbar />
      Dashboard
    </div>
  );
}
