import Header from "@/src/components/header";
import { product } from "@/src/constants/dummy";
import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ReorderCTA from "./bottom-bar";
import PriceBreakdown from "./price-breakdown";
import ProductEditableRow from "./product-row";
import OrderSummaryCard from "./summary-card";

export default function OrderDetails() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Order Details" actionType="notification" />
        <OrderSummaryCard
          date="01-01-2023"
          orderId="123456"
          address="Delhi NCR, 800021"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, marginTop: 0 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
          <ProductEditableRow
            item={product}
            onIncrease={() => {}}
            onDecrease={() => {}}
          />
        </ScrollView>
        <PriceBreakdown items={252} delivery={40} platform={10} total={292} />
        <ReorderCTA itemCount={2} total={252} hasUnavailable onAdd={() => {}} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
