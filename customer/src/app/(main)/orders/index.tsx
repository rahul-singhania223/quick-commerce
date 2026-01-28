import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import OrdersEmptyState from "./empty-state";
import { orders } from "@/src/constants/dummy";
import OrdersHeader from "./header";
import OngoingOrderCard from "./ongoing-order-card";

export default function Orders() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <OrdersHeader activeTab="Ongoing" onTabChange={() => {}} />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          {/* list */}
          {orders.map((order) => (
            <OngoingOrderCard key={order.id} order={order} />
          ))}

          {/* empty */}
          {/* <OrdersEmptyState type="Ongoing" onAction={() => {}} /> */}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
