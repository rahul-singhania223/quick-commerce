import { Pressable, StyleSheet, Text, View } from "react-native";

const DeleteAddressConfirm = ({
  onCancel = () => {},
  onDelete = () => {},
}) => (
  <View style={styles.confirmContainer}>
    <Text style={styles.confirmTitle}>Delete address?</Text>
    <Text style={styles.confirmMsg}>
      This address will be permanently removed.
    </Text>

    <View style={styles.btnRow}>
      <Pressable style={styles.cancelBtn} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
      <Pressable style={styles.deleteBtn} onPress={onDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  confirmContainer: { padding: 20, backgroundColor: "#FFF" },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  confirmMsg: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  btnRow: { gap: 12 },
  cancelBtn: {
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
  },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  deleteBtn: {
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
  },
  deleteText: { fontSize: 14, fontWeight: "600", color: "#DC2626" },
});

export default DeleteAddressConfirm;
