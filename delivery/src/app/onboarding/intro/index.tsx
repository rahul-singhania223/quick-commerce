import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// import BulletItem from "./components/BulletItem";
import { Colors } from "@/src/constants/theme";
import { router } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import IntroSkeleton from "./components/IntroSkeleton";

interface BulletItemProps {
  text: string;
}

interface IntroScreenProps {}

const IntroScreen = ({}: IntroScreenProps) => {
  const [loading, setLoading] = useState(true);

  // Simulate initial data fetch/skeleton effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <IntroSkeleton />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
          {/* <Text style={styles.headerTitle}>Delivery Partner App</Text> */}
        </View>

        <View style={styles.heroBlock}>
          <Text style={styles.primaryTitle}>
            Earn daily by delivering nearby orders
          </Text>

          <View style={styles.bulletList}>
            <BulletItem text="₹15–30 per delivery" />
            <BulletItem text="Flexible working hours" />
            <BulletItem text="Daily payouts to bank" />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryCta}
            onPress={() => router.push("/(auth)")} // Direct path to your first screen
          >
            <Text style={styles.primaryCtaText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryCta}>
            <Text style={styles.secondaryCtaText}>
              Already registered? <Text style={styles.loginLink}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Sub-component for clean bullet points

const BulletItem = ({ text }: BulletItemProps) => (
  <View style={styles.bulletRow}>
    <View style={styles.dot} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 64,
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
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#111827" },
  heroBlock: { flex: 1, padding: 16, paddingTop: 32 },
  primaryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    lineHeight: 28,
  },
  bulletList: { gap: 16 },
  bulletRow: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    marginRight: 12,
  },
  bulletText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  footer: { padding: 16, paddingBottom: 24 },
  primaryCta: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  primaryCtaText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  secondaryCta: { paddingVertical: 8, alignItems: "center" },
  secondaryCtaText: { fontSize: 13, color: "#6B7280" },
  loginLink: { color: "#111827", fontWeight: "600" },
});

export default IntroScreen;
