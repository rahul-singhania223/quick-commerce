import { StyleSheet, Text, View } from "react-native";

interface Props {
  items: number;
  delivery: number;
  platform: number;
  total: number;
}

const PriceBreakdown = ({ items, delivery, platform, total }: Props) => (
  <View style={styles.priceCard}>
    <View style={styles.breakdownRow}>
      <Text style={styles.label}>Item total</Text>
      <Text style={styles.val}>₹{items}</Text>
    </View>
    <View style={styles.breakdownRow}>
      <Text style={styles.label}>Delivery fee</Text>
      <Text style={styles.val}>₹{delivery}</Text>
    </View>
    <View style={styles.breakdownRow}>
      <Text style={styles.label}>Platform fee</Text>
      <Text style={styles.val}>₹{platform}</Text>
    </View>
    <View style={styles.breakdownDivider} />
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total</Text>
      <Text style={styles.totalVal}>₹{total}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  priceCard: {
    padding: 16,
    margin: 16,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontSize: 14, color: "#6B7280" },
  val: { fontSize: 14, color: "#111827" },
  breakdownDivider: {
    height: 1,
    backgroundColor: "#ECEDEF",
    marginVertical: 12,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { fontSize: 16, fontWeight: "600" },
  totalVal: { fontSize: 16, fontWeight: "700" },
});


export default PriceBreakdown;