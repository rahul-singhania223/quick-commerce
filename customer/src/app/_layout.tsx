import { useAuthStore } from "../store/auth.store";
import AddAddress from "./address/add";

export default function Layout() {
  const { status, bootstrap } = useAuthStore();

  // useEffect(() => {
  //   bootstrap();
  // }, []);

  // if (status === "idle" || status === "loading") return <ScreenLoader />;

  return <AddAddress navigation={null} route={{ params: { mode: "add" } }} />;
}
