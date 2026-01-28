import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/theme";

interface BillDetailsProps {
  itemTotal: number;
  deliveryCharge: number;
  platformFee: number;
}

const BillDetails = ({
  itemTotal,
  deliveryCharge,
  platformFee,
}: BillDetailsProps) => {
  const totalAmount = itemTotal + deliveryCharge + platformFee;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bill Details</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Item Total</Text>
        <Text style={styles.value}>₹{itemTotal}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Delivery Charge</Text>
        <Text style={styles.value}>₹{deliveryCharge}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Platform Fee</Text>
        <Text style={styles.value}>₹{platformFee}</Text>
      </View>

      {/* Horizontal Divider */}
      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{totalAmount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 32,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.foreground,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.mutedForeground,
    fontWeight: "400",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.foreground,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.foreground,
  },
});

export default BillDetails;