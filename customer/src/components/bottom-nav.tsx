import { Box, Home, RefreshCw, User } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/theme";

export const BottomNav = ({
  activeRoute = "Home",
  onNavigate,
}: {
  activeRoute?: string;
  onNavigate?: (name: string) => void;
}) => {
  const navItems = [
    { name: "Home", Icon: Home },
    { name: "Re-Order", Icon: RefreshCw },
    { name: "Orders", Icon: Box },
    { name: "Me", Icon: User },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeRoute === item.name;
        return (
          <Pressable
            key={item.name}
            style={styles.navItem}
            onPress={() => onNavigate?.(item.name)}
          >
            <item.Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 2}
              color={isActive ? Colors.primary : Colors.mutedForeground}
            />
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 20, // Adjust for safe areas if needed
    // paddingTop: 8,
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  labelActive: {
    color: Colors.primary,
  },
  labelInactive: {
    color: Colors.mutedForeground,
  },
});
