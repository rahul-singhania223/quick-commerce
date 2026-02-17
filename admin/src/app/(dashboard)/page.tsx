import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-md">
        <Link href={"/brands"}>
          <div className="h-20 rounded-lg flex items-center justify-center bg-white border shadow font-semibold text-xl">
            Brands
          </div>
        </Link>
        <Link href={"/categories"}>
          <div className="h-20 rounded-lg flex items-center justify-center bg-white border shadow font-semibold text-xl">
            Categories
          </div>{" "}
        </Link>
        <Link href={"/products"}>
          <div className="h-20 rounded-lg flex items-center justify-center bg-white border shadow font-semibold text-xl">
            Products
          </div>{" "}
        </Link>
        <Link href={"/zones"}>
          <div className="h-20 rounded-lg flex items-center justify-center bg-white border shadow font-semibold text-xl">
            Zones
          </div>{" "}
        </Link>
      </div>
    </div>
  );
}
