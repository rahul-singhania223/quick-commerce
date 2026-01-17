import BottomNav from "../store/[storeId]/components/bottom-nav";
import { Navbar } from "../store/[storeId]/components/navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
