import { Pencil } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
    name: string;
    contact: string;
    onEdit: () => void;
};

export const UserInfoCard = ({ name, contact, onEdit } : Props) => (
  <View style={styles.userCard}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{name.charAt(0)}</Text>
    </View>
    <View style={styles.infoCenter}>
      <Text style={styles.userName}>{name}</Text>
      <Text style={styles.userContact}>{contact}</Text>
    </View>
    <Pressable style={styles.editBtn} onPress={onEdit}>
      <Pencil size={18} color="#374151" />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 48
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "600", color: "#6B7280" },
  infoCenter: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  userContact: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserInfoCard