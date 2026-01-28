import { BottomNav } from "@/src/components/bottom-nav";
import { CartBar } from "@/src/components/cart-bar";
import { useAuthStore } from "@/src/store/auth.store";
import { Redirect, Stack, usePathname } from "expo-router";

export default function MainLayout() {
  const { status, user } = useAuthStore();

  const pathname = usePathname();
  const currentScreen = pathname.split("/")[1];

  const screensWithoutCartBar = [
    "cart",
    "checkout",
    "search",
    "re-order",
    "orders",
    "profile",
  ];
  const screensWithoutBottomNav = ["search"];

  if (status === "unauthenticated" || !user)
    return <Stack screenOptions={{ headerShown: false }} />;

  if (!user._count || !user._count.addresses || user._count.addresses === 0)
    return <Redirect href={"/address"} />;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {!screensWithoutCartBar.includes(currentScreen) && (
        <CartBar itemCount={12} total={456} onViewCart={() => {}} />
      )}
      {!screensWithoutBottomNav.includes(currentScreen) && <BottomNav />}
    </>
  );
}
