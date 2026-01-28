import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

interface StatusCardProps {
    status: string;
    eta: string;
    subtext: string;
    isDelayed: boolean;
}

export const StatusCard = ({ status, eta, subtext, isDelayed } : StatusCardProps) => (
  <View style={[styles.statusCard, isDelayed && styles.delayedCard]}>
    <Text style={[styles.statusTitle, isDelayed && styles.delayedText]}>
      {status}
    </Text>
    {!isDelayed && <Text style={styles.etaText}>Arriving in {eta} mins</Text>}
    <Text style={[styles.subtext, isDelayed && styles.delayedSubtext]}>
      {subtext}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  statusCard: {
    backgroundColor: "#2DBE60",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    gap: 4,
    marginTop: 48
  },
  delayedCard: { backgroundColor: "#FEF3C7" },
  statusTitle: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  delayedText: { color: "#92400E" },
  etaText: { fontSize: 14, fontWeight: "500", color: "#ECFDF3" },
  subtext: { fontSize: 13, color: "#D1FAE5" },
  delayedSubtext: { color: "#B45309" },
});

export default StatusCard;