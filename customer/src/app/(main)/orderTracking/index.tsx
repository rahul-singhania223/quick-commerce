import Header from "@/src/components/header";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import StatusCard from "./status-card";
import TrackingTimeline from "./timeline";
import RiderCard from "./rider-card";

export default function OrderTracking() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Header title="Order Tracking" actionType="notification" />
        <StatusCard
          status="Order Placed"
          eta="10"
          subtext="Your order is on the way"
          isDelayed={false}
        />

        <TrackingTimeline currentStep={1} />

        <RiderCard name="Rahul Singhania" avatar={require("@/src/assets/images/hero.png")} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
