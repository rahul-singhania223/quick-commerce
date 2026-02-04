import { Colors } from "@/src/constants/theme";
import { router } from "expo-router";
import { ChevronDown, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type VehicleType = "Bike" | "Scooter" | null;

const BasicDetailsScreen = () => {
  const [name, setName] = useState<string>("");
  const [city, setCity] = useState<string>("Mumbai, Maharashtra"); // Pre-filled example
  const [vehicle, setVehicle] = useState<VehicleType>(null);
  const [referral, setReferral] = useState<string>("");
  const [showReferral, setShowReferral] = useState<boolean>(false);

  const isFormValid =
    name.trim().length > 2 && city.length > 0 && vehicle !== null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Basic Details</Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* City Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>City / Area</Text>
              <TouchableOpacity style={styles.dropdown}>
                <View style={styles.row}>
                  <MapPin
                    size={18}
                    color={Colors.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.dropdownText}>{city}</Text>
                </View>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Vehicle Type Chips */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Type</Text>
              <View style={styles.chipContainer}>
                {(["Bike", "Scooter"] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setVehicle(type)}
                    style={[styles.chip, vehicle === type && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        vehicle === type && styles.chipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {showReferral && (
              <TextInput
                style={[styles.input, styles.referralInput]}
                placeholder="Enter code"
                value={referral}
                onChangeText={setReferral}
                autoFocus
              />
            )}
          </ScrollView>

          {/* Sticky Bottom CTA */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.cta, !isFormValid && styles.ctaDisabled]}
              disabled={!isFormValid}
              onPress={() => router.push("/(auth)/verify")}
            >
              <Text style={styles.ctaText}>Submit & Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  flex: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 24 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 28,
  },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 8 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  dropdown: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
  },
  row: { flexDirection: "row", alignItems: "center" },
  dropdownText: { fontSize: 15, color: "#111827" },
  chipContainer: { flexDirection: "row", gap: 12 },
  chip: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    borderColor: `${Colors.primary}`,
    backgroundColor: `${Colors.primary}0D`,
  },
  chipText: { fontSize: 15, fontWeight: "500", color: "#4B5563" },
  chipTextActive: { color: Colors.primary },
  referralToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  referralToggleText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
    marginRight: 4,
  },
  referralInput: { marginTop: 8, height: 48, backgroundColor: "#F9FAFB" },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  cta: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaDisabled: { backgroundColor: "#D1D5DB" },
  ctaText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});

export default BasicDetailsScreen;
