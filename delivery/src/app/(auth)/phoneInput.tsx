import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface PhoneInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  countryCode?: string;
  error?: boolean;
}

const PhoneInputField = ({
  value,
  onChangeText,
  countryCode = "+91",
  error,
} : PhoneInputFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your phone number</Text>
      <View style={[styles.inputWrapper, error && styles.errorBorder]}>
        <TouchableOpacity style={styles.countryPicker}>
          <Text style={styles.countryText}>🇮🇳 {countryCode}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          placeholder="9876543210"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={10}
          value={value}
          onChangeText={onChangeText}
          autoFocus={true}
        />
      </View>
      <Text style={[styles.helperText, error && styles.errorText]}>
        {error
          ? "Enter a valid mobile number"
          : "We’ll send you a one-time password"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "600", // SemiBold
    color: "#111827",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  errorBorder: {
    borderColor: "#DC2626",
  },
  countryPicker: {
    width: 85,
    alignItems: "center",
    justifyContent: "center",
  },
  countryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    paddingHorizontal: 12,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
  errorText: {
    color: "#DC2626",
  },
});

export default PhoneInputField;
