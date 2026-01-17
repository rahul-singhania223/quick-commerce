"use client";

import { cn } from "@/lib/utils";
import {
  Box,
  ChartBar,
  ChartSpline,
  Home,
  IndianRupee,
  LayoutDashboard,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const dashboardPath = pathname.split("/")[0] + "/" + pathname.split("/")[1];
  const currentPath = pathname.split("/")[2] || "/";


  return (
    <div className="lg:hidden flex items-center justify-between fixed bottom-0 left-0 right-0 px-4 py-3 bg-white shadow border-t border-border">
      <Link
        href={dashboardPath}
        className={cn("flex flex-col items-center space-y-1", {
          "text-primary": currentPath === "/",
        })}
      >
        <LayoutDashboard className="size-5.5" />
        <span className="text-sm font-semibold!">Home</span>
      </Link>
      <Link
        href={dashboardPath + "/inventory"}
        className={cn("flex flex-col items-center space-y-1", {
          "text-primary": currentPath === "inventory",
        })}
      >
        <Box className="size-5.5" />
        <span className="text-sm font-semibold">Inventory</span>
      </Link>
      <Link
        href={dashboardPath + "/analytics"}
        className={cn("flex flex-col items-center space-y-1", {
          "text-primary": currentPath === "analytics",
        })}
      >
        <ChartSpline className="size-5.5" />
        <span className="text-sm font-semibold">Analytics</span>
      </Link>
      <Link
        href={dashboardPath + "/money"}
        className={cn("flex flex-col items-center space-y-1", {
          "text-primary": currentPath === "money",
        })}
      >
        <IndianRupee className="size-5.5" />
        <span className="text-sm font-semibold">Money</span>
      </Link>
      <Link
        href={dashboardPath + "/settings"}
        className={cn("flex flex-col items-center space-y-1", {
          "text-primary": currentPath === "settings",
        })}
      >
        <Store className="size-5.5" />
        <span className="text-sm font-semibold">Store</span>
      </Link>
    </div>
  );
}
