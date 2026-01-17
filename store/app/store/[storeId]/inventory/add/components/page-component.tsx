"use client";

import { Button } from "@/components/ui/button";
import Header from "./header";
import InventoryForm from "./inventory-form";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PageNav from "@/components/page-nav";

export default function PageComponent() {
  return (
    <div className="pt-16">
      <PageNav title="Add Inventory" />
      <InventoryForm />
    </div>
  );
}
