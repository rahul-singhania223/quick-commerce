import { Clock, X } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle = ({ children }: SectionTitleProps) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

interface RecentSearchItemProps {
  text: string;
  onRemove: () => void;
}

const RecentSearchItem = ({ text, onRemove }: RecentSearchItemProps) => (
  <View style={styles.recentItem}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Clock size={18} color="#9CA3AF" style={{ marginRight: 12 }} />
      <Text style={styles.recentText}>{text}</Text>
    </View>
    <Pressable onPress={onRemove}>
      <X size={16} color="#9CA3AF" />
    </Pressable>
  </View>
);

interface SearchChipProps {
  label: string;
  onPress: () => void;
}

const SearchChip = ({ label, onPress }: SearchChipProps) => (
  <Pressable style={styles.chip} onPress={onPress}>
    <Text style={styles.chipText}>{label}</Text>
  </Pressable>
);

export default function RecentSearch() {
  return (
    <View>
      <SectionTitle>Recent searches</SectionTitle>
      <RecentSearchItem text="Product 1" onRemove={() => {}} />
      <RecentSearchItem text="Product 2" onRemove={() => {}} />
      <RecentSearchItem text="Product 3" onRemove={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  recentItem: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECEDEF",
  },
  recentText: { fontSize: 13, color: "#111827" },
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 13, color: "#374151" },
});
