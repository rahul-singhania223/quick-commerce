import EmptyState from "./components/empty-state";
import Inventory from "./components/inventory";
import Navbar from "./components/navbar";

export default function InventoryPage() {
  return (
    <div className="">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-64px)]">
        {/* <EmptyState /> */}
        <Inventory />
      </div>
    </div>
  );
}
