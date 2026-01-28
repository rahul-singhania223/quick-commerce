import { Colors } from "@/src/constants/theme";
import { Image } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
    type: "Ongoing" | "Past";
    onAction: () => void;
}

const OrdersEmptyState = ({ type, onAction } : Props) => {
  const isOngoing = type === "Ongoing";

  return (
    <View style={styles.emptyContainer}>
      {/* <Image
        source={
          isOngoing
            ? require("@/assets/ongoing-empty.png")
            : require("@/assets/past-empty.png")
        }
        style={styles.illustration}
        resizeMode="contain"
      /> */}
      <Text style={styles.heading}>
        {isOngoing ? "No active orders" : "Your past orders will appear here"}
      </Text>
      {isOngoing && (
        <>
          <Text style={styles.subheading}>
            Once you place an order, you can track it here.
          </Text>
          <Pressable style={styles.startBtn} onPress={onAction}>
            <Text style={styles.startBtnText}>Start shopping</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  illustration: { maxHeight: 160, width: "100%", marginBottom: 16 },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  subheading: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  startBtn: {
    height: 44,
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  startBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});

export default OrdersEmptyState;