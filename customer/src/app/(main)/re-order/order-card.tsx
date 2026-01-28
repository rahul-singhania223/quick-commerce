import { deliveryItems } from "@/src/constants/dummy";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface OrderCardProps {
  order: any;
  onReOrder: (order: any) => void;
  onViewDetails: () => void;
}

interface DeliveryItem {
  image: string;
  name: string;
  quantity: number;
}

const OrderCard = ({
  order = { items: deliveryItems },
  onReOrder,
  onViewDetails,
}: OrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayItems = isExpanded
    ? order.items
    : (order.items.slice(0, 3) as DeliveryItem[]);
  const remainingCount = order.items.length - 3;

  return (
    <View style={styles.card}>
      {/* Meta Row */}
      <View style={styles.metaRow}>
        <Text style={styles.dateText}>Delivered on {order.date}</Text>
        <Text style={styles.totalText}>₹{order.total}</Text>
      </View>

      {/* Product List */}
      <View style={styles.productList}>
        {displayItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.productImg} />
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.qtyText}>×{item.quantity}</Text>
          </View>
        ))}
      </View>

      {remainingCount > 0 && !isExpanded && (
        <Pressable onPress={() => setIsExpanded(true)}>
          <Text style={styles.moreText}>+{remainingCount} more items</Text>
        </Pressable>
      )}

      {/* Action Row */}
      <View style={styles.actionRow}>
        <Pressable onPress={onViewDetails}>
          <Text style={styles.secondaryBtnText}>View details</Text>
        </Pressable>
        <Pressable style={styles.primaryBtn} onPress={() => onReOrder(order)}>
          <Text style={styles.primaryBtnText}>Re-order</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateText: { fontSize: 13, color: "#6B7280" },
  totalText: { fontSize: 13, fontWeight: "500", color: "#111827" },
  itemRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  productImg: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#F7F8FA",
  },
  productName: { flex: 1, fontSize: 13, color: "#111827" },
  qtyText: { fontSize: 13, color: "#6B7280" },
  moreText: { fontSize: 11, color: "#6B7280", marginTop: 4 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  secondaryBtnText: { fontSize: 13, color: "#6B7280" },
  primaryBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#2DBE60",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  productList: {
    marginBottom: 12,
  },
});

export default OrderCard;