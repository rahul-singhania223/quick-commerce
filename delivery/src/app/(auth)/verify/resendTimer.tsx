import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const ResendTimer = ({ onResend }) => {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const timer =
      seconds > 0 && setInterval(() => setSeconds(seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  if (seconds > 0) {
    return <Text style={styles.timerText}>Resend code in {seconds}s</Text>;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        setSeconds(30);
        onResend();
      }}
    >
      <Text style={styles.resendText}>
        Didn’t receive it? <Text style={styles.linkText}>Resend OTP</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 12,
  },
  resendText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },
  linkText: {
    color: "#2563EB",
    fontWeight: "500",
  },
});

export default ResendTimer;
