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
import {
  ChartSpline,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Package2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logout as logoutUser } from "@/quries/auth.query";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

export function Sidebar({ children }: Props) {
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const dashboardPath =
    pathname.split("/")[0] +
    "/" +
    pathname.split("/")[1] +
    "/" +
    pathname.split("/")[2];
  const currentPath = pathname.split("/")[3] || "/";

  const logout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      const res = await logoutUser();
      toast.success("Logged out successfully!");
      router.push("/auth");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout!");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild className="hidden lg:flex">
        <Button variant="outline">{children}</Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-2 max-w-xs! z-100 flex flex-col">
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
        <div className="space-y-2  flex-1">
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
          <Link
            href={dashboardPath + "/money"}
            className={cn(
              "flex items-center gap-4 font-medium text-body hover:bg-muted/50 p-3 rounded-lg hover:text-foreground",
              { "text-foreground bg-muted": currentPath === "/money" }
            )}
          >
            <IndianRupee />
            <span>Money</span>
          </Link>
        </div>
        <Button
          disabled={loggingOut}
          onClick={logout}
          variant={"ghost"}
          className="text-destructive space-x-2 hover:text-destructive"
        >
          <LogOut />
          <span>Logout</span>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
