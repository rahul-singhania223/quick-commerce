import { Colors } from "@/src/constants/theme";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

type PaymentType = "UPI" | "COD" | "Card";

interface PaymentMethodProps {
  selectedMethod: PaymentType;
  onSelect: (method: PaymentType) => void;
}

const PaymentMethodSelector = ({
  selectedMethod,
  onSelect,
}: PaymentMethodProps) => {
  const methods = [
    { id: "UPI" as PaymentType, label: "UPI", recommended: true },
    { id: "COD" as PaymentType, label: "Cash On Delivery", recommended: false },
    { id: "Card" as PaymentType, label: "Card (Online)", recommended: false },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Method</Text>

      <View style={styles.list}>
        {methods.map((item) => {
          const isSelected = selectedMethod === item.id;

          return (
            <Pressable
              key={item.id}
              style={styles.methodItem}
              onPress={() => onSelect(item.id)}
            >
              {/* Radio Button UI */}
              <View
                style={[
                  styles.radioOuter,
                  isSelected && styles.radioOuterSelected,
                ]}
              >
                {isSelected && <View style={styles.radioInner} />}
              </View>

              <View style={styles.labelRow}>
                <Text style={styles.methodLabel}>{item.label}</Text>

                {item.recommended && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Recommended</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.foreground,
    marginBottom: 20,
  },
  list: {
    gap: 24, // Consistent spacing between items
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#0f172a", // Matching the dark color in Frame 168
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    backgroundColor: "#0f172a",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.foreground,
  },
  badge: {
    backgroundColor: "#E0F2FE", // Light blue background
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.blue,
    fontSize: 11,
    fontWeight: "700",
  },
});

export default PaymentMethodSelector;