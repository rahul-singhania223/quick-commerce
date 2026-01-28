import { CheckCircle2, Circle } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";

interface TrackingTimelineProps {
    currentStep: number;
}


export const TrackingTimeline = ({ currentStep } : TrackingTimelineProps) => {
  const steps = ["Order placed", "Packed", "Out for delivery", "Delivered"];

  return (
    <View style={styles.timelineContainer}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <View key={step} style={styles.stepRow}>
            <View style={styles.iconColumn}>
              {isCompleted || isCurrent ? (
                <CheckCircle2 size={20} color="#2DBE60" />
              ) : (
                <Circle size={20} color="#D1D5DB" />
              )}
              {index !== steps.length - 1 && (
                <View style={[styles.line, isCompleted && styles.lineActive]} />
              )}
            </View>
            <View style={styles.textColumn}>
              <Text style={[styles.stepLabel, isCurrent && styles.activeLabel]}>
                {step} {isCurrent && <Text style={styles.nowBadge}>Now</Text>}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  timelineContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  stepRow: { flexDirection: "row", minHeight: 50 },
  iconColumn: { alignItems: "center", width: 20, marginRight: 16 },
  line: { width: 2, flex: 1, backgroundColor: "#E5E7EB", marginVertical: 4 },
  lineActive: { backgroundColor: "#2DBE60" },
  textColumn: { paddingTop: 2 },
  stepLabel: { fontSize: 14, color: "#6B7280" },
  activeLabel: { fontWeight: "700", color: "#111827" },
  nowBadge: {
    fontSize: 10,
    color: "#2DBE60",
    fontWeight: "800",
    textTransform: "uppercase",
  },
});

export default TrackingTimeline;