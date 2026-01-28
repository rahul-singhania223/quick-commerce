import React, { useEffect, useRef } from "react";
import { CheckCircle2, Info, X } from "lucide-react-native";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/theme";
import { useToastStore } from "../store/toast.store";

export default function ToastHost() {
  const { open, type, message, onClose } = useToastStore();

  // Animation values
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      // Slide in and Fade in
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();

      // Auto-hide timer logic (Optional: adjust based on your store logic)
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      animatedValue.setValue(0);
    }
  }, [open]);

  const hideToast = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!open) return null;

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0], // Starts 20px higher than final position
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.7, 1],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.toast,
          { opacity, transform: [{ translateY }] },
          type === "success" && styles.successToast,
          type === "error" && styles.errorToast,
        ]}
      >
        {type === "success" && <CheckCircle2 size={20} color={Colors.green} />}
        {type === "error" && <Info size={20} color={Colors.red} />}
        <Text
          style={[
            styles.toastText,
            type === "success" && styles.successText,
            type === "error" && styles.errorText,
          ]}
        >
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    top: 60, // Position adjusted for status bar clearance
    left: 0,
    right: 0,
    zIndex: 100,
  },
  toast: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Shadow/Elevation
    elevation: 6,
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  toastText: {
    fontSize: 14,
    fontWeight: "700", // Bolder for high readability
    marginLeft: 8,
  },
  successText: { color: Colors.green },
  errorText: { color: Colors.red },
  successToast: { borderColor: Colors.green + "20", borderWidth: 1 },
  errorToast: { borderColor: Colors.red + "20", borderWidth: 1 },
});
