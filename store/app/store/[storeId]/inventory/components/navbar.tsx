"use client";

import { Sidebar } from "@/app/store/[storeId]/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, PanelLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between h-16 bg-white border-b border-border px-3 lg:px-6">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold mr-4">Inventory</h2>
        <Sidebar>
          <PanelLeft />
        </Sidebar>
      </div>

      <Button
        onClick={() => router.push(location.pathname + "/add")}
        className="h-10 font-medium"
      >
        Add Product
      </Button>
    </nav>
  );
}
