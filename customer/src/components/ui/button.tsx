import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Colors } from "@/src/constants/theme";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export const Button = ({
  onPress,
  variant = "default",
  size = "default",
  loading = false,
  disabled = false,
  style,
  textStyle,
  children
}: ButtonProps) => {
  // Combine styles based on state and props
  const getContainerStyle = (pressed: boolean): ViewStyle[] => [
    styles.base,
    styles[variant] as ViewStyle,
    styles[size] as ViewStyle,
    // Using spread with conditional avoids the "false" assignment error
    ...(pressed
      ? [
          variant === "link" || variant === "ghost"
            ? { opacity: 0.7 }
            : styles.pressed,
        ]
      : []),
    ...(disabled || loading ? [styles.disabled] : []),
    style as ViewStyle,
  ];

  const getTextStyle = (): TextStyle[] => [
    styles.textBase,
    styles[`${variant}Text` as keyof typeof styles] as TextStyle,
    styles[`${size}Text` as keyof typeof styles] as TextStyle,
    textStyle as TextStyle,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => getContainerStyle(pressed)}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "default" ? "#fff" : Colors.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{children}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6, // Shadcn radius
  },
  textBase: {
    fontSize: 14,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  // Variants
  default: {
    backgroundColor: Colors.primary,
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  defaultText: {
    color: Colors.primaryForeground,
  },
  destructive: {
    backgroundColor: Colors.destructive,
  },
  destructiveText: {
    color: "#fff",
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "transparent",
  },
  outlineText: {
    color: Colors.foreground,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  secondaryText: {
    color: Colors.secondaryForeground,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: Colors.foreground,
  },
  link: {
    backgroundColor: "transparent",
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  // Sizes
  sm: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  lg: {
    height: 44,
    paddingHorizontal: 32,
  },
  icon: {
    height: 40,
    width: 40,
  },
});
