import { Colors } from "@/src/constants/theme";
import { router } from "expo-router";
import { Check, CheckSquare, Square } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface RequirementItem {
  id: string;
  label: string;
}

const REQUIREMENTS: RequirementItem[] = [
  { id: "1", label: "Age 18+" },
  { id: "2", label: "Smartphone with internet" },
  { id: "3", label: "Valid driving license" },
  { id: "4", label: "Two-wheeler (bike/scooter)" },
  { id: "5", label: "Bank account" },
];

const RequirementsScreen = () => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollPadding}
        >
          <Text style={styles.title}>Before you continue</Text>

          <View style={styles.listContainer}>
            {REQUIREMENTS.map((item) => (
              <View key={item.id} style={styles.row}>
                <View style={styles.iconCircle}>
                  <Check size={14} color="#16A34A" strokeWidth={3} />
                </View>
                <Text style={styles.rowText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkboxRow}
            activeOpacity={0.7}
            onPress={() => setIsConfirmed(!isConfirmed)}
          >
            {isConfirmed ? (
              <CheckSquare size={24} color={Colors.primary} fill="#FFFFFF" />
            ) : (
              <Square size={24} color="#D1D5DB" />
            )}
            <Text style={styles.checkboxLabel}>
              I confirm I meet all requirements
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cta, !isConfirmed && styles.ctaDisabled]}
            disabled={!isConfirmed}
            onPress={() => router.push("/(auth)")}
          >
            <Text style={styles.ctaText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  logo: {
    width: 100,
    height: 32,
    objectFit: "contain",
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  scrollPadding: {
    padding: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 24,
  },
  listContainer: {
    gap: 8,
  },
  row: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#DCFCE7", // Light green background for the check
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "400",
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  cta: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaDisabled: {
    backgroundColor: "#D1D5DB",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RequirementsScreen;
