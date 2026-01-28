import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SavingsBannerProps {
  amount: number;
}

export const SavingsBanner = ({ amount }: SavingsBannerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🥳 You saved ₹{amount} on this order!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ECFDF5", // Soft emerald green background
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#065F46", // Dark emerald green for high contrast
    textAlign: "center",
  },
});

export default SavingsBanner;