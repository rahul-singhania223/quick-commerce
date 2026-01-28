import { useAuthStore } from "@/src/store/auth.store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { status } = useAuthStore();

  if (status === "authenticated") return <Redirect href={"/home"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
