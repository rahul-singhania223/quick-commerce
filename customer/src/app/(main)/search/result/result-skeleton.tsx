
import { StyleSheet, View } from "react-native";

const SearchResultSkeleton = () => (
  <View style={styles.card}>
    <View style={[styles.image, { backgroundColor: "#F3F4F6" }]} />
    <View style={styles.details}>
      <View
        style={{
          height: 16,
          width: "80%",
          backgroundColor: "#F3F4F6",
          borderRadius: 4,
        }}
      />
      <View
        style={{
          height: 12,
          width: "40%",
          backgroundColor: "#F3F4F6",
          borderRadius: 4,
          marginTop: 8,
        }}
      />
      <View
        style={{
          height: 16,
          width: "20%",
          backgroundColor: "#F3F4F6",
          borderRadius: 4,
          marginTop: 12,
        }}
      />
    </View>
    <View style={[styles.addBtn, { backgroundColor: "#F3F4F6" }]} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    height: 96,
    flexDirection: "row",
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ECEDEF",
  },
  image: { width: 64, height: 64, borderRadius: 8 },
  details: { flex: 1, marginLeft: 16 },
  name: { fontSize: 14, fontWeight: "500", color: "#111827" },
  meta: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  price: { fontSize: 14, fontWeight: "600", color: "#111827" },
  discount: { fontSize: 11, color: "#2DBE60", fontWeight: "600" },
  oosLabel: { fontSize: 11, color: "#DC2626", marginTop: 2 },
  actionArea: { justifyContent: "center" },
  addBtn: {
    height: 32,
    paddingHorizontal: 16,
    backgroundColor: "#2DBE60",
    borderRadius: 8,
    justifyContent: "center",
  },
  disabledBtn: { backgroundColor: "#E5E7EB" },
  addBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
});

export default SearchResultSkeleton;