import { Image, StyleSheet, Text, View } from "react-native";
import { AddAddressButton } from "./addressCard";

const AddressEmptyState = ({ onAdd= () => {} }) => (
  <View style={styles.emptyContainer}>
    {/* <Image
      source={require("@/assets/address-empty.png")}
      style={styles.illustration}
      resizeMode="contain"
    /> */}
    <Text style={styles.emptyTitle}>No addresses saved yet</Text>
    <Text style={styles.emptySub}>Add an address to get deliveries faster</Text>
    <AddAddressButton onPress={onAdd} />
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  illustration: { maxHeight: 160, width: "100%", marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  emptySub: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
});

export default AddressEmptyState;