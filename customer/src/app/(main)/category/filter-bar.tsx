import { Colors } from "@/src/constants/theme";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface FilterBarProps {
  onOpenSort?: () => void;
  onOpenFilter?: () => void;
}

export default function FilterBar({
  onOpenSort,
  onOpenFilter,
}: FilterBarProps) {
  const [activeTab, setActiveTab] = useState("Bestseller");

  const tabs = ["Bestseller", "Discount", "High Rated", "New Arrivals"];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sort Trigger */}
        <Pressable style={styles.outlineBtn} onPress={onOpenSort}>
          <Text style={styles.outlineBtnText}>Sort</Text>
          <ChevronDown size={14} color={Colors.foreground} />
        </Pressable>

        {/* Filter Trigger */}
        <Pressable style={styles.outlineBtn} onPress={onOpenFilter}>
          <Text style={styles.outlineBtnText}>Filter</Text>
          <ChevronDown size={14} color={Colors.foreground} />
        </Pressable>

        {/* Pill Tabs */}
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.pill,
              activeTab === tab ? styles.pillActive : styles.pillInactive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                activeTab === tab
                  ? styles.pillTextActive
                  : styles.pillTextInactive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, backgroundColor: "#fff", marginTop: 32 },
  scrollContent: { paddingHorizontal: 16, gap: 8, alignItems: "center" },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outlineBtnText: { fontSize: 14, fontWeight: "400", color: Colors.foreground },
  pill: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  pillActive: { backgroundColor: `${Colors.primary}20`, borderWidth: 1, borderColor: Colors.primary },
  pillInactive: { backgroundColor: Colors.muted },
  pillText: { fontSize: 13, fontWeight: "500", color: Colors.foreground },
  pillTextActive: { color: Colors.primary },
  pillTextInactive: { color: Colors.foreground },
});
