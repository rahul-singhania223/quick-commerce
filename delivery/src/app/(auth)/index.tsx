import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BrandHeader from "./header";
import PhoneInputField from "./phoneInput";

const AuthScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isValid = phoneNumber.length === 10;

  const handleContinue = () => {
    if (isValid) {
      setIsLoading(true);
      // Logic to trigger OTP would go here
      console.log("Sending OTP to:", phoneNumber);
    } else {
      setHasError(true);
    }
  };

  return (
    <SafeAreaProvider>

    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.statusBarSpacer} />

          <BrandHeader valueProp="Groceries delivered in 10 minutes" />

          <PhoneInputField
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (hasError) setHasError(false);
            }}
            error={hasError}
          />
        </View>

        {/* Sticky Bottom Section */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.ctaButton,
              (!isValid || isLoading) && styles.ctaDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.ctaText}>Continue</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.legalText}>
            By continuing, you agree to our{" "}
            <Text style={styles.linkText}>Terms</Text> &{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  statusBarSpacer: {
    height: 24,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    marginTop: 12,
  },
  ctaButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#16A34A",
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
  legalText: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },
  linkText: {
    color: "#2563EB",
  },
});

export default AuthScreen;
