import { Pressable, StyleSheet, Text, View } from "react-native";

interface ReorderCTAProps {
  itemCount: number;
  total: number;
  hasUnavailable: boolean;
  onAdd: () => void;
}

const ReorderCTA = ({
  itemCount,
  total,
  hasUnavailable,
  onAdd,
}: ReorderCTAProps) => (
  <View style={styles.bottomBar}>
    <View>
      <Text style={styles.countText}>{itemCount} items</Text>
      <Text style={styles.totalText}>₹{total}</Text>
    </View>
    <Pressable style={styles.ctaBtn} onPress={onAdd}>
      <Text style={styles.ctaText}>
        {hasUnavailable ? "Add available items" : "Add all to cart"}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  bottomBar: {
    height: 72,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 56,
  },
  countText: { fontSize: 13, color: "#6B7280" },
  totalText: { fontSize: 16, fontWeight: "600", color: "#111827" },
  ctaBtn: {
    height: 44,
    paddingHorizontal: 20,
    backgroundColor: "#2DBE60",
    borderRadius: 10,
    justifyContent: "center",
  },
  ctaText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
});

export default ReorderCTA;