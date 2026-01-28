import Header from "@/src/components/header";
import { Button } from "@/src/components/ui/button";
import { products } from "@/src/constants/dummy";
import { Colors } from "@/src/constants/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BillDetails from "./bill-details";
import DeliveryHeader from "./delivery-header";
import ProductCard from "./product-card";
import SavingsBanner from "./savings-banner";

export default function Cart() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Cart" actionType="notification" />
        <DeliveryHeader address="Delhi NCR, 800021" onChangePress={() => {}} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, marginBottom: 120 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        >
          <View style={styles.productsContainer}>
            {products.map((product) => (
              <ProductCard
                name={product.name}
                brand={product.brand}
                category={product.category}
                weight={product.weight}
                price={product.price}
                imageSource={product.image}
              />
            ))}
          </View>
          <BillDetails deliveryCharge={40} platformFee={10} itemTotal={252} />
          <SavingsBanner amount={29} />
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
  productsContainer: {
    // marginBottom: 140,
  },
});
