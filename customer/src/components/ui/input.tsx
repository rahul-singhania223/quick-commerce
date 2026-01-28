import { Colors } from "@/src/constants/theme";
import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  description?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, description, style, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TextInput
          ref={ref}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error ? styles.inputError : null,
            style,
          ]}
          placeholderTextColor="#a1a1aa" // shadcn muted foreground
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {description && !error && (
          <Text style={styles.description}>{description}</Text>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#09090b", // shadcn foreground
    marginBottom: 8,
  },
  input: {
    height: 45,
    width: "100%",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7", // shadcn border
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#09090b",
  },
  inputFocused: {
    borderColor: `${Colors.primary}50`, 
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: "#ef4444", // shadcn destructive
  },
  description: {
    fontSize: 12,
    color: "#71717a", // shadcn muted-foreground
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    fontWeight: "500",
  },
});
