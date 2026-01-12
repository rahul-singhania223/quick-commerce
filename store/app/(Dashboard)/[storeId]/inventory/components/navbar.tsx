"use client";

import { Sidebar } from "@/app/(Dashboard)/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, PanelLeft, Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between h-16 bg-white border-b border-border px-6">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold mr-4">Inventory</h2>
        <Sidebar>
          <PanelLeft />
        </Sidebar>
      </div>

      <Button>Add Product</Button>
    </nav>
  );
}
