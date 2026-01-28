import { Button } from "@/src/components/ui/button";
import { Colors } from "@/src/constants/theme";
import authServices from "@/src/services/auth.services";
import { ErrorResponse, OtpMeta, SuccessResponse } from "@/src/types/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  isSubmitting: boolean;
  phone: string;
  session_id: string;
  error: string;
  setError: (msg: string) => void;
  otpMeta: OtpMeta | null;
}

export default function ResendButton({
  isSubmitting,
  phone,
  session_id,
  setError,
  otpMeta,
}: Props) {
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const disabled = isSubmitting || resending || timeLeft > 0;

  const resendOTP = async () => {
    if (disabled) return;

    if (!phone || !session_id) {
      setError("Phone & sessionId are required!");
      return;
    }

    try {
      setResending(true);

      const res = await authServices.getOtp(phone);
      const resData = res.data as SuccessResponse;
      const { session_id: newSessionId } = resData.data;

      router.replace({
        pathname: "/auth/verify",
        params: {
          session_id: newSessionId,
          phone,
        },
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to resend OTP";

      setError(message);
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!otpMeta) return;

    setTimeLeft(otpMeta.time_left);

    const tick = () => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [otpMeta]);

  return (
    <Button
      onPress={resendOTP}
      disabled={disabled}
      style={styles.resendButton}
      loading={resending}
    >
      <Text style={[styles.resendButtonText, disabled && styles.buttonTimer]}>
        {timeLeft > 0 ? `00:${String(timeLeft).padStart(2, "0")}` : "Resend"}
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  resendButton: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
  },

  resendButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.blue,
  },

  buttonTimer: {
    color: Colors.mutedForeground,
  },

  pressed: {
    opacity: 0.6,
  },
});
