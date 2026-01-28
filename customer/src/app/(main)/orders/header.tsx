import { Colors } from "@/src/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const OrdersHeader = ({ activeTab, onTabChange }: Props) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.appBar}>
        <Text style={styles.title}>Orders</Text>
      </View>

      <View style={styles.tabBar}>
        {["Ongoing", "Past"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => onTabChange(tab)}
              style={styles.tabItem}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: { backgroundColor: "#FFFFFF" },
  appBar: {
    height: 56,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 20, fontWeight: "600", color: "#111827" },
  tabBar: {
    height: 48,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ECEDEF",
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#6B7280" },
  tabTextActive: { color: Colors.primary },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    backgroundColor: Colors.primary,
    width: "40%", // Matches text width approximately
  },
});


export default OrdersHeader