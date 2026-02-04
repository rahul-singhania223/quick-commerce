import {
  ChevronDown,
  Headphones,
  History,
  Radar,
  User,
  Wallet,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type RiderState = "OFFLINE" | "WAITING" | "INCOMING" | "ACTIVE";

const { width } = Dimensions.get("window");

const RiderDashboard: React.FC = () => {
  const [state, setState] = useState<RiderState>("OFFLINE");
  const [timer, setTimer] = useState(15);

  // Simple timer logic for incoming order
  useEffect(() => {
    let interval: number;
    if (state === "INCOMING" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setState("WAITING");
      setTimer(15);
    }
    return () => clearInterval(interval);
  }, [state, timer]);

  const toggleAvailability = () => {
    setState(state === "OFFLINE" ? "WAITING" : "OFFLINE");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* A. Top Status Bar (Sticky) */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.toggleBase,
              state === "OFFLINE" ? styles.toggleOff : styles.toggleOn,
            ]}
            onPress={toggleAvailability}
            activeOpacity={0.9}
          >
            <Text style={styles.toggleText}>
              {state === "OFFLINE" ? "Offline" : "Online"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.zoneSelector}>
            <Text style={styles.zoneText}>Sector 18, Noida</Text>
            <ChevronDown size={14} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* B. Earnings Snapshot Card */}
          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>Today's Earnings</Text>
            <Text style={styles.earningsAmount}>₹842</Text>
            <Text style={styles.earningsSub}>5 deliveries completed</Text>

            <View style={styles.earningsDivider} />

            <View style={styles.earningsRow}>
              <Text style={styles.earningsDetail}>⏱ Online: 2h 10m</Text>
              <Text style={styles.earningsDetail}>📦 Avg: ₹168</Text>
            </View>
          </View>

          {/* C. Primary State Area */}
          <View style={styles.stateArea}>
            {state === "OFFLINE" && (
              <View style={styles.offlinePrompt}>
                <Text style={styles.offlineText}>
                  You are currently offline
                </Text>
                <Text style={styles.offlineSub}>
                  Go online to start receiving orders
                </Text>
              </View>
            )}

            {state === "WAITING" && (
              <View style={styles.waitingCard}>
                <Radar size={32} color="#16A34A" style={styles.radarIcon} />
                <Text style={styles.waitingTitle}>You’re online</Text>
                <Text style={styles.waitingSub}>
                  Waiting for nearby orders...
                </Text>
                <Text style={styles.microcopy}>
                  Stay near busy stores for faster orders
                </Text>
              </View>
            )}

            {state === "ACTIVE" && (
              <View style={styles.activeCard}>
                <View style={styles.activeHeader}>
                  <Text style={styles.activeTitle}>Active Order: #4920</Text>
                  <View style={styles.blueBadge}>
                    <Text style={styles.blueBadgeText}>ON THE WAY</Text>
                  </View>
                </View>
                <View style={styles.stepContainer}>
                  <StepItem label="Go to store" completed />
                  <StepItem label="Pick up order" active />
                  <StepItem label="Deliver to customer" />
                </View>
                <TouchableOpacity
                  style={styles.activeCta}
                  onPress={() => setState("WAITING")}
                >
                  <Text style={styles.activeCtaText}>Picked Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* D. Quick Actions */}
          <View style={styles.grid}>
            <QuickAction
              icon={<Wallet size={20} color="#374151" />}
              label="Earnings"
            />
            <QuickAction
              icon={<History size={20} color="#374151" />}
              label="History"
            />
            <QuickAction
              icon={<Headphones size={20} color="#374151" />}
              label="Support"
            />
            <QuickAction
              icon={<User size={20} color="#374151" />}
              label="Profile"
            />
          </View>
        </ScrollView>

        {/* STATE 2: Incoming Order (Overlay) */}
        {state === "INCOMING" && (
          <View style={styles.overlay}>
            <View style={styles.incomingCard}>
              <View style={styles.incomingHeader}>
                <View>
                  <Text style={styles.storeName}>FreshMart</Text>
                  <Text style={styles.distanceText}>1.2 km away from you</Text>
                </View>
                <View style={styles.timerCircle}>
                  <Text style={styles.timerText}>{timer}s</Text>
                </View>
              </View>

              <View style={styles.incomingDetails}>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Earnings</Text>
                  <Text style={styles.detailVal}>₹85</Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Deliver</Text>
                  <Text style={styles.detailVal}>2.8 km</Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>ETA</Text>
                  <Text style={styles.detailVal}>18 min</Text>
                </View>
              </View>

              <View style={styles.incomingActions}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => setState("WAITING")}
                >
                  <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => setState("ACTIVE")}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Manual Trigger for Demo Purposes */}
        {state === "WAITING" && (
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => setState("INCOMING")}
          >
            <Text style={{ color: "#fff" }}>Simulate Incoming Order</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Sub-components
const QuickAction = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <TouchableOpacity style={styles.gridItem}>
    {icon}
    <Text style={styles.gridLabel}>{label}</Text>
  </TouchableOpacity>
);

const StepItem = ({
  label,
  active,
  completed,
}: {
  label: string;
  active?: boolean;
  completed?: boolean;
}) => (
  <View style={styles.stepRow}>
    <View
      style={[
        styles.stepDot,
        completed && styles.dotCompleted,
        active && styles.dotActive,
      ]}
    />
    <Text style={[styles.stepText, active && styles.stepTextActive]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  toggleBase: {
    width: 80,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleOff: { backgroundColor: "#E5E7EB" },
  toggleOn: { backgroundColor: "#16A34A" },
  toggleText: { fontSize: 13, fontWeight: "600", color: "#FFFFFF" },
  zoneSelector: { flexDirection: "row", alignItems: "center" },
  zoneText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginRight: 4,
  },
  scrollBody: { flex: 1 },
  earningsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
  },
  earningsLabel: { fontSize: 13, color: "#166534", fontWeight: "500" },
  earningsAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#166534",
    marginVertical: 4,
  },
  earningsSub: { fontSize: 13, color: "#166534", opacity: 0.8 },
  earningsDivider: {
    height: 1,
    backgroundColor: "#166534",
    opacity: 0.1,
    marginVertical: 12,
  },
  earningsRow: { flexDirection: "row", justifyContent: "space-between" },
  earningsDetail: { fontSize: 12, color: "#166534", fontWeight: "500" },
  stateArea: { paddingHorizontal: 16, marginBottom: 24 },
  offlinePrompt: { padding: 40, alignItems: "center" },
  offlineText: { fontSize: 16, fontWeight: "600", color: "#374151" },
  offlineSub: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  waitingCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    alignItems: "center",
  },
  radarIcon: { marginBottom: 12 },
  waitingTitle: { fontSize: 16, fontWeight: "600", color: "#374151" },
  waitingSub: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  microcopy: { fontSize: 11, color: "#9CA3AF", marginTop: 12 },
  activeCard: { padding: 16, borderRadius: 16, backgroundColor: "#EFF6FF" },
  activeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  activeTitle: { fontSize: 15, fontWeight: "600", color: "#1E40AF" },
  blueBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  blueBadgeText: { fontSize: 10, fontWeight: "700", color: "#1E40AF" },
  stepContainer: { gap: 12, marginBottom: 20 },
  stepRow: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginRight: 12,
  },
  dotActive: { backgroundColor: "#2563EB", transform: [{ scale: 1.2 }] },
  dotCompleted: { backgroundColor: "#16A34A" },
  stepText: { fontSize: 14, color: "#6B7280" },
  stepTextActive: { color: "#1E40AF", fontWeight: "600" },
  activeCta: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activeCtaText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8 },
  gridItem: {
    width: (width - 48) / 2,
    height: 72,
    backgroundColor: "#F9FAFB",
    margin: 8,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  gridLabel: {
    fontSize: 12,
    color: "#374151",
    marginTop: 4,
    fontWeight: "500",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    padding: 16,
  },
  incomingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  incomingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  storeName: { fontSize: 18, fontWeight: "700", color: "#111827" },
  distanceText: { fontSize: 13, color: "#6B7280" },
  timerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: { color: "#DC2626", fontWeight: "700" },
  incomingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
  },
  detailBox: { alignItems: "center" },
  detailLabel: { fontSize: 11, color: "#6B7280", marginBottom: 4 },
  detailVal: { fontSize: 15, fontWeight: "700", color: "#111827" },
  incomingActions: { flexDirection: "row", gap: 12 },
  rejectBtn: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  rejectText: { color: "#DC2626", fontWeight: "600" },
  acceptBtn: {
    flex: 2,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },
  acceptText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
  trigger: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
  },
});

export default RiderDashboard;
