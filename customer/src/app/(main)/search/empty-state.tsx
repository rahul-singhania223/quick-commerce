import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
    onRetry: () => void;
}

const SearchEmptyState = ({ onRetry } : Props) => (
  <View style={styles.emptyContainer}>
    {/* TODO: Change image */}
    <Image
      source={require("@/src/assets/images/no-results.png")}
      style={styles.emptyIllustration}
      resizeMode="contain"
    />
    <Text style={styles.emptyText}>No results found</Text>
    <Pressable style={styles.ctaButton} onPress={onRetry}>
      <Text style={styles.ctaText}>Explore Categories</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyIllustration: { maxHeight: 160, width: "100%", marginBottom: 16 },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 24,
  },
  ctaButton: {
    height: 44,
    width: "100%",
    backgroundColor: "#2DBE60",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
});


export default SearchEmptyState