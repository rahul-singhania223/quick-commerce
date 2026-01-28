import { Button } from "@/src/components/ui/button";
import { Colors } from "@/src/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface OngoingOrderCardProps {
  order: any;
}


const OngoingOrderCard = ({ order }: OngoingOrderCardProps) => (
  <View style={styles.ongoingCard}>
    <View style={styles.statusRow}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>🟢 {order.status}</Text>
      </View>
      <Text style={styles.orderId}>#{order.id}</Text>
    </View>

    <View style={styles.storeInfo}>
      <Text style={styles.storeName}>{order.storeName}</Text>
      <Text style={styles.etaText}>Arriving in {order.eta} mins</Text>
    </View>

    <View style={styles.itemPreview}>
      {order.items.slice(0, 2).map((item, i) => (
        <Text key={i} style={styles.previewText}>
          {item.name} ×{item.qty}
        </Text>
      ))}
      {order.items.length > 2 && (
        <Text style={styles.previewText}>
          +{order.items.length - 2} more items
        </Text>
      )}
    </View>

    <View style={styles.actionRow}>
      <Text style={styles.priceText}>₹{order.total}</Text>
      <View style={styles.btnGroup}>
        <Button variant="secondary" style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>View details</Text>
        </Button>
        <Pressable style={styles.trackBtn}>
          <Text style={styles.trackBtnText}>Track order</Text>
        </Pressable>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  ongoingCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#EAFBF1",
    justifyContent: "center",
  },
  badgeText: { fontSize: 11, fontWeight: "600", color: "#16A34A" },
  orderId: { fontSize: 11, color: "#9CA3AF" },
  storeInfo: { marginTop: 12 },
  storeName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  etaText: { fontSize: 13, color: "#16A34A", marginTop: 2 },
  itemPreview: { marginTop: 12, gap: 2 },
  previewText: { fontSize: 13, color: "#6B7280" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  priceText: { fontSize: 14, fontWeight: "600", color: "#111827" },
  btnGroup: { flexDirection: "row", alignItems: "center", gap: 12 },
  secondaryBtn: { height: 36, paddingHorizontal: 16, borderRadius: 8, backgroundColor: Colors.secondary },
  secondaryBtnText: { fontSize: 13, color: "#6B7280" },
  trackBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  trackBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
});

export default OngoingOrderCard;
