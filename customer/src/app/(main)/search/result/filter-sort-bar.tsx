import { Colors } from "@/src/constants/theme";
import { ArrowUpDown } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  activeFilter: string;
  onFilterPress: (filter: string) => void;
  onSortPress: () => void;
};

const FilterSortBar = ({ activeFilter, onFilterPress, onSortPress }: Props) => {
  const filters = ["Brand", "Price", "Pack size", "Delivery time"];

  return (
    <View style={styles.stickyBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <Pressable
              key={filter}
              onPress={() => onFilterPress(filter)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.divider} />
      <Pressable style={styles.sortBtn} onPress={onSortPress}>
        <Text style={styles.sortText}>Sort</Text>
        <ArrowUpDown size={16} color="#374151" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  stickyBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECEDEF",
  },
  chipScroll: { paddingHorizontal: 16, alignItems: "center", gap: 8 },
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: `${Colors.primary}20`,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  chipText: { fontSize: 13, color: "#374151" },
  chipTextActive: { color: Colors.primary },
  divider: { width: 1, height: 24, backgroundColor: "#ECEDEF" },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
  },
  sortText: { fontSize: 13, color: "#374151" },
});

export default FilterSortBar;
