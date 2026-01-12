"use client";

import api from "@/config/api.config";
import { inventoryQuery } from "@/quries/inventory.query";
import { Inventory as InventoryType } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "./inventory-column";
import { DataTable } from "./data-table";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { any } from "zod";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { useInventoryStore } from "@/zustand-store/inventory.store";

interface InventoryItemProps {
  item: InventoryType;
}

export default function Inventory() {
  const params = useParams();
  const { storeId } = params;

  const [loading, setLoading] = useState(true);
  const [filteredInventory, setFilteredInventory] = useState<InventoryType[]>(
    []
  );

  const { inventory, setInventory } = useInventoryStore();

  const filterInventory = (value: string) => {
    const inventoryArr = Array.from(inventory.values());
    const filtered = inventoryArr.filter((item) =>
      item.store_product?.variant?.product?.name
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: filteredInventory,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (!storeId) return;
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await inventoryQuery.getStoreInventory(storeId as string);
        setInventory(res.data.data as InventoryType[]);
        setFilteredInventory(res.data.data as InventoryType[]);
      } catch (error) {
        console.log(error);
        toast.error("Couldn't fetch inventory!");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [storeId]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="text-muted-foreground animate-spin" />
      </div>
    );

  return (
    <div className="p-6 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter names..."
            onChange={(event) => filterInventory(event.target.value as string)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DataTable
          columns={columns}
          data={filteredInventory}
          table={table as any}
        />
      </div>
    </div>
  );
}
