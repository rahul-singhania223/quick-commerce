import { Phone } from "lucide-react-native";
import { ImageSourcePropType, StyleSheet } from "react-native";
import { Image, Pressable, Text, View } from "react-native";

interface RiderCardProps {
    name: string;
    avatar: ImageSourcePropType;
}

export const RiderCard = ({ name, avatar } : RiderCardProps) => (
  <View style={styles.riderCard}>
    <Image source={avatar} style={styles.avatar} />
    <View style={styles.riderInfo}>
      <Text style={styles.riderName}>{name}</Text>
      <Text style={styles.riderTitle}>Delivery partner</Text>
    </View>
    <Pressable style={styles.callBtn}>
      <Phone size={20} color="#2DBE60" />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  riderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  riderInfo: { flex: 1, marginLeft: 12 },
  riderName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  riderTitle: { fontSize: 12, color: "#6B7280" },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ECFDF3",
    justifyContent: "center",
    alignItems: "center",
  },
});


export default RiderCard