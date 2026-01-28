import { Colors } from "@/src/constants/theme";
import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle } from "react-native";

interface DeliveryHeaderProps {
  address: string;
  onChangePress: () => void;
  style?: ViewStyle
}

const DeliveryHeader = ({
  address,
  onChangePress,
  style
}: DeliveryHeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Delivering to:</Text>

      <View style={styles.addressRow}>
        <Text style={styles.addressText} numberOfLines={1}>
          {address}
        </Text>

        <Pressable
          onPress={onChangePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.changeText}>Change</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 32,
  },
  label: {
    fontSize: 13,
    color: Colors.mutedForeground,
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "700", // Heavy weight to match Frame 139
    color: Colors.foreground,
    flexShrink: 1, // Ensures text doesn't push the "Change" button off screen
  },
  changeText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.blue, // Using your blue hex: #3b82f6
  },
});

export default DeliveryHeader;