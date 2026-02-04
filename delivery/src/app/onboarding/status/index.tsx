import { Colors } from "@/src/constants/theme";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Headphones,
} from "lucide-react-native";
import React from "react";
import {
    Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type OnboardingStatus = "UNDER_REVIEW" | "READY";

interface StatusProps {
  status: OnboardingStatus;
  navigation: any;
}

const OnboardingStatusScreen = ({ status = "UNDER_REVIEW" }) => {
  const isReady = status === "READY";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        <StatusBar barStyle="dark-content" />

        <View style={styles.content}>
          {/* Icon Section */}
          <View
            style={[
              styles.iconContainer,
              isReady ? styles.bgReady : styles.bgReview,
            ]}
          >
            {isReady ? (
              <CheckCircle2 size={48} color="#16A34A" strokeWidth={2.5} />
            ) : (
              <Clock size={48} color="#F59E0B" strokeWidth={2.5} />
            )}
          </View>

          {/* Text Section */}
          <View style={styles.textBlock}>
            <Text style={styles.title}>
              {isReady
                ? "You’re ready to deliver 🎉"
                : "We’re reviewing your details"}
            </Text>

            <Text style={styles.subtitle}>
              {isReady
                ? "Your account is active. You can now start accepting orders in your area."
                : "This usually takes less than 24 hours. We’ll notify you once approved."}
            </Text>
          </View>
        </View>

        {/* Sticky Bottom CTA Section */}
        <View style={styles.footer}>
          {isReady ? (
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => console.log("Navigate to Home")}
            >
              <Text style={styles.primaryCtaText}>Go Online</Text>
              <ArrowRight size={20} color="#FFFFFF" style={styles.ctaIcon} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryCta}
                onPress={() => console.log("Refresh Status")}
              >
                <Text style={styles.primaryCtaText}>Check status</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryCta}>
                <Headphones
                  size={18}
                  color="#374151"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.secondaryCtaText}>Contact support</Text>
              </TouchableOpacity>
            </>
          )}
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
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  bgReview: {
    backgroundColor: "#FFFBEB", // Light amber
  },
  bgReady: {
    backgroundColor: "#DCFCE7", // Light green
  },
  textBlock: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  primaryCta: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  ctaIcon: {
    marginLeft: 8,
  },
  secondaryCta: {
    height: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryCtaText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
});

export default OnboardingStatusScreen;
