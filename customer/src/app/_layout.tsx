import Landing from ".";
import { useAuthStore } from "../store/auth.store";
import Cart from "./(main)/cart";
import Category from "./(main)/category";
import HomeScreen from "./(main)/home";
import ReOrder from "./(main)/re-order";
import AuthScreen from "./auth";
import VerificationScreen from "./auth/verify";

export default function Layout() {
  const { status, bootstrap } = useAuthStore();

  // useEffect(() => {
  //   bootstrap();
  // }, []);

  // if (status === "idle" || status === "loading") return <ScreenLoader />;

  return <ReOrder />;
}
