import { Product } from "@/src/types/types";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  item: Product;
  onIncrease: () => void;
  onDecrease: () => void;
}

const ProductEditableRow = ({ item, onIncrease, onDecrease }: Props) => {
  const isOutOfStock = false;

  return (
    <View style={[styles.productRow, isOutOfStock && { opacity: 0.5 }]}>
      <Image source={item.images[0].image} style={styles.productImg} />
      <View style={styles.centerInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        {isOutOfStock ? (
          <Text style={styles.errorText}>Currently unavailable</Text>
        ) : (
          <View style={styles.priceRow}>
            {item.mrp && <Text style={styles.strikethrough}>₹{item.mrp}</Text>}
            <Text style={styles.currentPrice}>₹{item.price}</Text>
          </View>
        )}
      </View>

      <View style={styles.stepper}>
        <Pressable
          disabled={isOutOfStock}
          onPress={onDecrease}
          style={styles.stepBtn}
        >
          <Text style={[styles.stepIcon, isOutOfStock && { color: "#9CA3AF" }]}>
            −
          </Text>
        </Pressable>
        <Text style={styles.qtyText}>{10}</Text>
        <Pressable
          disabled={isOutOfStock}
          onPress={onIncrease}
          style={styles.stepBtn}
        >
          <Text style={[styles.stepIcon, isOutOfStock && { color: "#9CA3AF" }]}>
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productRow: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECEDEF",
  },
  productImg: { width: 48, height: 48, borderRadius: 8 },
  centerInfo: { flex: 1, marginHorizontal: 12 },
  productName: { fontSize: 13, color: "#111827" },
  priceRow: { flexDirection: "row", gap: 6, marginTop: 2 },
  currentPrice: { fontSize: 13, fontWeight: "500", color: "#111827" },
  strikethrough: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  errorText: { fontSize: 11, color: "#DC2626", marginTop: 2 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
  },
  stepBtn: { paddingHorizontal: 8 },
  stepIcon: { fontSize: 14, color: "#111827" },
  qtyText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
    width: 20,
    textAlign: "center",
  },
});

export default ProductEditableRow;
