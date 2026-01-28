import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Bike } from "lucide-react-native";
import { Colors } from "@/src/constants/theme";

interface DeliveryInfoProps {
  timeInMinutes?: number;
  freeDeliveryThreshold?: number;
  style?: ViewStyle
}

const DeliveryInfo = ({
  timeInMinutes = 10,
  freeDeliveryThreshold = 99,
  style
}: DeliveryInfoProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <Bike size={20} color={Colors.blue} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>Delivery in {timeInMinutes} minutes</Text>
        </View>

        <Text style={styles.subtitle}>
          Free delivery on orders above ₹{freeDeliveryThreshold}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F3F4F6", // Light gray background to match Frame 130
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginTop: 32,
  },
  content: {
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    // Optional: add a small background to the icon if needed
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.foreground,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mutedForeground,
    marginLeft: 30, // Aligns text under the title, past the icon
  },
});

export default DeliveryInfo;