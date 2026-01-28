import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { Colors } from "../constants/theme";
import { Button } from "./ui/button";

interface CartBarProps {
    itemCount: number;
    total: number;
    onViewCart: () => void;
}

export const CartBar = ({ itemCount, total, onViewCart } : CartBarProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <ShoppingCart color="white" size={20} />
          <Text style={styles.cartText}>
            {itemCount} Items | ₹{total}
          </Text>
        </View>

        <Button style={styles.button} onPress={onViewCart}>
          <Text style={styles.buttonText}>View Cart</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 80,
    right: 0,
    left: 0,
  },
  container: {
    width: "100%",
    backgroundColor: "#0f172a", // Deep dark blue/black
    height: 60,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cartText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  button: {
    backgroundColor: Colors.primary, 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
