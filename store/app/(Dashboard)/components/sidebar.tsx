"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChartSpline, LayoutDashboard, Package2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export function Sidebar({ children }: Props) {
  const pathname = usePathname();

  const dashboardPath = pathname.split("/")[0] + "/" + pathname.split("/")[1];
  const currentPath = pathname.split("/")[2] || "/";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{children}</Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-2 max-w-xs!">
        <SheetHeader className="">
          <div className="flex items-center">
            <Image
              className="w-10 h-10 object-contain mr-2"
              src="/images/logo.png"
              alt="logo"
              width={200}
              height={200}
            />
            <span className="font-semibold">Store Parter</span>
          </div>
          <SheetTitle className="hidden">Sidebar</SheetTitle>
          <SheetDescription className="hidden">
            Navigate through your sidebar
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-2">
          <Link
            href={dashboardPath}
            className={cn(
              "flex items-center gap-4 font-medium text-body hover:bg-muted/50 p-3 rounded-lg hover:text-foreground",
              { "text-foreground bg-muted": currentPath === "/" }
            )}
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>
          <Link
            href={dashboardPath + "/inventory"}
            className={cn(
              "flex items-center gap-4 font-medium text-body hover:bg-muted/50 p-3 rounded-lg hover:text-foreground",
              { "text-foreground bg-muted": currentPath === "/inventory" }
            )}
          >
            <Package2 />
            <span>Inventory</span>
          </Link>
          <Link
            href={dashboardPath + "/analytics"}
            className={cn(
              "flex items-center gap-4 font-medium text-body hover:bg-muted/50 p-3 rounded-lg hover:text-foreground",
              { "text-foreground bg-muted": currentPath === "/analytics" }
            )}
          >
            <ChartSpline />
            <span>Analytics</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
