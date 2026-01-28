import Header from "@/src/components/header";
import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import StickyReOrderBar from "./bottom-bar";
import OrderCard from "./order-card";

export default function ReOrder() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {/* header */}
        <Header title="Re-order" actionType="cart" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, marginTop: 28 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        >
          {/* list */}
          <OrderCard
            onReOrder={() => {}}
            onViewDetails={() => {}}
            order={undefined}
          />
          <OrderCard
            onReOrder={() => {}}
            onViewDetails={() => {}}
            order={undefined}
          />
          <OrderCard
            onReOrder={() => {}}
            onViewDetails={() => {}}
            order={undefined}
          />
          <OrderCard
            onReOrder={() => {}}
            onViewDetails={() => {}}
            order={undefined}
          />
        </ScrollView>

        <StickyReOrderBar itemCount={12} total={456} onAddToCart={() => {}} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
