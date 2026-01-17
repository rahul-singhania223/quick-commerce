import { Button } from "@/components/ui/button";
import Header from "./components/header";
import { Plus, Store } from "lucide-react";
import StoreCard from "./components/store-card";
import { PageComponent } from "./components/page-component";

export default async function StorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  return <PageComponent />;
}
