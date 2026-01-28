import { MapPin } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  date: string;
  orderId: string;
  address: string;
}

const OrderSummaryCard = ({ date, orderId, address }: Props) => (
  <View style={styles.summaryCard}>
    <View style={styles.metaRow}>
      <Text style={styles.dateText}>Delivered on {date}</Text>
      <Text style={styles.idText}>Order ID: {orderId}</Text>
    </View>
    <View style={styles.addressRow}>
      <MapPin size={16} color="#6B7280" />
      <Text style={styles.addressText} numberOfLines={1}>
        {address}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 28
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateText: { fontSize: 13, color: "#6B7280" },
  idText: { fontSize: 11, color: "#9CA3AF" },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  addressText: { fontSize: 13, color: "#374151" },
});

export default OrderSummaryCard;
