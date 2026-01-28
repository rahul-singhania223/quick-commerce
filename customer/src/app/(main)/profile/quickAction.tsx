import { ShoppingBag, MapPin, CreditCard, LifeBuoy } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Pressable, Text, View } from "react-native";

interface QuickActionsProps {
    onNavigate: (screen: string) => void;
}

export const QuickActions = ({ onNavigate } : QuickActionsProps) => {
  const actions = [
    { id: "Orders", icon: ShoppingBag, label: "Orders" },
    { id: "Addresses", icon: MapPin, label: "Addresses" },
    { id: "Payments", icon: CreditCard, label: "Payments" },
    { id: "Help", icon: LifeBuoy, label: "Help & Support" },
  ];

  return (
    <View style={styles.grid}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          style={styles.actionCard}
          onPress={() => onNavigate(action.id)}
        >
          <action.icon size={24} color="#2DBE60" />
          <Text style={styles.actionLabel}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionCard: {
    width: "48%", // Approx 2 columns
    height: 72,
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    gap: 8,
  },
  actionLabel: { fontSize: 13, fontWeight: "500", color: "#111827" },
});


export default QuickActions