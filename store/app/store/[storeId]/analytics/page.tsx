import Chart from "@/components/chart";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="text-lg font-semibold bg-white p-4 flex items-center gap-4">
        <Image
          src="/images/logo.png"
          className="w-10"
          alt="logo"
          width={150}
          height={150}
        />
        <h1>Analytics</h1>
      </div>

      <div className="mt-0">
        <div className="p-3 space-y-8">
          <div className="bg-white p-4 rounded-lg shadow-xs h-28 flex items-center">
            <div className="space-y-1">
              <div className="text-muted-foreground">Today Sells</div>
              <h2 className="text-2xl font-bold">₹ 25,425.00</h2>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant={"secondary"} className="bg-primary text-white">
              1D
            </Button>
            <Button variant={"secondary"} className="">
              7D
            </Button>
            <Button variant={"secondary"} className="">
              1M
            </Button>
            <Button variant={"secondary"} className="">
              6M
            </Button>
            <Button variant={"secondary"} className="">
              1Y
            </Button>
            <Button variant={"secondary"} className="">
              All Time
            </Button>
          </div>

          <Chart />
        </div>
      </div>
    </div>
  );
}
