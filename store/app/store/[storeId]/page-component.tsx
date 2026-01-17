"use client";

import { useEffect } from "react";
import { Navbar } from "./components/navbar";
import { validate as isValidUUID } from "uuid";
import { useRouter } from "next/navigation";

interface Props {
  storeId: string;
}

export default function PageComponent({ storeId }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!storeId || !isValidUUID(storeId)) router.back();
  }, [storeId]);

  if (!storeId || !isValidUUID(storeId)) return null;

  return (
    <div>
      <Navbar />
      Dashboard
    </div>
  );
}
