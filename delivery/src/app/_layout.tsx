import "react-native-reanimated";
import RiderDashboard from "./(main)/dashboard";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return <RiderDashboard />;
}
