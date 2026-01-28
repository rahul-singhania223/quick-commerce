import { Colors } from "@/src/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface StickyReOrderBarProps {
    itemCount: number;
    total: number;
    onAddToCart: () => void;
}

const StickyReOrderBar = ({ itemCount, total, onAddToCart } : StickyReOrderBarProps) => (
  <View style={styles.stickyBar}>
    <View>
      <Text style={styles.stickyItemText}>Items: {itemCount}</Text>
      <Text style={styles.stickyTotalText}>₹{total}</Text>
    </View>
    <Pressable style={styles.ctaButton} onPress={onAddToCart}>
      <Text style={styles.ctaText}>Add to cart</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  stickyBar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
  },
  stickyItemText: { fontSize: 13, color: "#6B7280" },
  stickyTotalText: { fontSize: 16, fontWeight: "700", color: "#111827" },
  ctaButton: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  ctaText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});

export default StickyReOrderBar