import Header from "@/src/components/header";
import { Button } from "@/src/components/ui/button";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BillDetails from "../cart/bill-details";
import DeliveryHeader from "../cart/delivery-header";
import DeliveryInfo from "../product/delivery-info";
import PaymentMethodSelector from "./paymentMethod-selector";
import { Colors } from "@/src/constants/theme";

export default function Checkout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Checkout" actionType="notification" />
        <DeliveryHeader
          style={{ backgroundColor: "#fff", paddingVertical: 20 }}
          address="Delhi NCR, 800021"
          onChangePress={() => {}}
        />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <DeliveryInfo style={{ marginTop: 0, borderRadius: 0 }} />
          <PaymentMethodSelector selectedMethod="UPI" onSelect={() => {}} />
          <BillDetails deliveryCharge={40} platformFee={10} itemTotal={252} />
        </ScrollView>
        {/* total */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaAmount}>₹252</Text>
          <Button style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Place Order </Text>
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  deliveryTimeContainer: {},
  ctaContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 80,
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.foreground,
  },
  ctaButton: {
    borderRadius: 8,
  },
  ctaButtonText: {},
});
