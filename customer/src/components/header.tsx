import { Colors } from "@/src/constants/theme";
import { GlobalStyles } from "@/src/styles/global.styles";
import { Bell, ChevronLeft, ShoppingCart } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  title: string;
  actionType: "cart" | "notification" | "none";
  onBack?: () => void;
}

export default function Header({ title, onBack, actionType }: HeaderProps) {
  return (
    <View style={GlobalStyles.header}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <ChevronLeft size={20} color={Colors.foreground} strokeWidth={2} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Empty view to balance the flex layout for true centering */}
      <Pressable style={styles.cartButton}>
        {actionType === "cart" && (
          <>
            <ShoppingCart
              size={21}
              color={Colors.foreground}
              strokeWidth={1.8}
            />
            <Text style={styles.cartCount}>4</Text>
          </>
        )}
        {actionType === "notification" && (
          <View style={styles.notification}>
            <Bell size={21} color={Colors.foreground} strokeWidth={1.8} />
            <View
              style={{
                width: 6,
                height: 6,
                backgroundColor: "red",
                borderRadius: 50,
                position: "absolute",
                top: 0,
                right: 2,
              }}
            />
          </View>
        )}

        {actionType === "none" && <></>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 80, // Fixed width to match the spacer
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.foreground,
    marginLeft: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.foreground,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: 80,
  },
  cartCount: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 4,
    backgroundColor: Colors.primary,
    width: 18,
    height: 18,
    borderRadius: 10,
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  notification: {
    position: "relative",
  },
});
