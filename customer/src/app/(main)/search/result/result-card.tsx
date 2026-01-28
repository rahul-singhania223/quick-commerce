import { Image, StyleSheet } from "react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Product } from "@/src/types/types";
import { Colors } from "@/src/constants/theme";


interface Props {
    item: Product;
    onAdd: () => void;
}

const SearchResultCard = ({ item, onAdd } : Props) => {
  const isOutOfStock = false;

  return (
    <View style={[styles.card, isOutOfStock && { opacity: 0.5 }]}>
      <Image source={item.images[0].image} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.meta}>
          {item.variant} • {item.brand}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          {item.discount && (
            <Text style={styles.discount}>{item.discount}% OFF</Text>
          )}
        </View>
        {isOutOfStock && <Text style={styles.oosLabel}>Out of stock</Text>}
      </View>

      <View style={styles.actionArea}>
        <Pressable
          disabled={isOutOfStock}
          style={[styles.addBtn, isOutOfStock && styles.disabledBtn]}
          onPress={onAdd}
        >
          <Text style={styles.addBtnText}>
            {isOutOfStock ? "Unavailable" : "Add"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 96,
    flexDirection: "row",
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECEDEF",
  },
  image: { width: 64, height: 64, borderRadius: 8 },
  details: { flex: 1, marginLeft: 16 },
  name: { fontSize: 14, fontWeight: "500", color: "#111827" },
  meta: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  price: { fontSize: 14, fontWeight: "600", color: "#111827" },
  discount: { fontSize: 11, color: "#2DBE60", fontWeight: "600" },
  oosLabel: { fontSize: 11, color: "#DC2626", marginTop: 2 },
  actionArea: { justifyContent: "center" },
  addBtn: {
    height: 32,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: "center",
  },
  disabledBtn: { backgroundColor: "#E5E7EB" },
  addBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
});


export default SearchResultCard
