import Header from "@/src/components/header";
import { Button } from "@/src/components/ui/button";
import { product, products } from "@/src/constants/dummy";
import { Colors } from "@/src/constants/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../home/product-card";
import ImageSlider from "./image-slider";
import DeliveryInfo from "./delivery-info";
import ProductDescription from "./product-description";

export default function Product() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Product" actionType="cart" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          style={styles.container}
        >
          {/* Product Details */}
          <View>
            <ImageSlider data={product.images} />
            {/* name */}
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.meta}>
                {product.variant} | {product.brand}
              </Text>
            </View>

            {/* price */}
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>₹{product.price}</Text>
              <Text style={styles.originalPrice}>₹{product.mrp}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}% OFF</Text>
              </View>
            </View>

            {/* cta */}
            <Button style={styles.ctaButton}>
              <Text style={styles.ctaText}>Add to Cart</Text>
            </Button>
          </View>
          <DeliveryInfo />
          <ProductDescription description={product.description} />
          <View style={styles.relatedProductsContainer}>
            <Text style={styles.relatedProductsTitle}>Related Products</Text>
            <ScrollView
            style={{ width: "100%"}}
              contentContainerStyle={{ paddingRight: 40 }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.products}>
                {products.map((product, index) => (
                  <ProductCard
                    key={index}
                    {...product}
                    style={{ borderWidth: 1, borderColor: Colors.border }}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 116,
    marginTop: 32,
    backgroundColor: "#fff",
  },
  nameContainer: {
    marginTop: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    maxWidth: "85%",
    marginBottom: 8,
    color: Colors.foreground,
  },
  meta: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.foreground,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.mutedForeground,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  ctaButton: {
    marginTop: 32,
    height: 50,
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
  },
  relatedProductsContainer: {
    marginTop: 32,
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.foreground,
    marginBottom: 20,
  },
  products: {
    maxWidth: "100%",
    flexDirection: "row",
    gap: 16,
    // paddingHorizontal: 16, // optional, but usually needed
  },
});
