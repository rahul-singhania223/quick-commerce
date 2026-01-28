import { StyleSheet } from "react-native";

import { Pressable, Text, View } from "react-native";
import { AlertCircle, Plus } from "lucide-react-native";

import { MoreVertical } from "lucide-react-native";

import { Colors } from "@/src/constants/theme";

interface AddressCardProps {
  item: any;
  onMenuPress: (item: any) => void;
}

export const AddAddressButton = ({ onPress = () => {} }) => (
  <Pressable style={styles.addBtn} onPress={onPress}>
    <Plus size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
    <Text style={styles.addBtnText}>Add new address</Text>
  </Pressable>
);

export const AddressCard = ({ item, onMenuPress }: AddressCardProps) => {
  const isDefault = item.isDefault;
  const isServiceable = item.isServiceable;

  return (
    <View style={[styles.card, !isServiceable && { opacity: 0.5 }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.chip, isDefault && styles.defaultChip]}>
          <Text style={[styles.chipText, isDefault && styles.defaultChipText]}>
            {item.label}
          </Text>
        </View>

        <Pressable onPress={() => onMenuPress(item)}>
          <MoreVertical size={20} color="#111827" />
        </Pressable>
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.addressText} numberOfLines={3}>
          {item.fullAddress}
        </Text>
        <Text style={styles.phoneText}>{item.phone}</Text>

        {isDefault && <Text style={styles.defaultLabel}>Default address</Text>}

        {!isServiceable && (
          <View style={styles.warningRow}>
            <AlertCircle size={12} color="#DC2626" />
            <Text style={styles.warningText}>Currently not serviceable</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    margin: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  chip: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
  },
  defaultChip: { backgroundColor: `${Colors.primary}20` },
  chipText: { fontSize: 11, fontWeight: "600", color: "#374151" },
  defaultChipText: { color: Colors.primary },
  details: { gap: 4 },
  name: { fontSize: 14, fontWeight: "600", color: "#111827" },
  addressText: { fontSize: 13, color: "#374151", lineHeight: 18 },
  phoneText: { fontSize: 11, color: "#6B7280" },
  defaultLabel: {
    fontSize: 11,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: "500",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  warningText: { fontSize: 11, color: "#DC2626", fontWeight: "500" },
});

export default AddressCard;
