import { OTPInput } from "@/src/components/otp-input";
import { Button } from "@/src/components/ui/button";
import { Colors } from "@/src/constants/theme";
import authServices from "@/src/services/auth.services";
import { useToastStore } from "@/src/store/toast.store";
import { ErrorResponse, OtpMeta, SuccessResponse } from "@/src/types/types";
import { saveTokens } from "@/src/utils/token.utils";
import { AxiosError } from "axios";
import { RelativePathString, router } from "expo-router";
import { memo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ResendButton from "../resend-button";

interface Props {
  otpMeta: OtpMeta | null;
  phone: string;
  return_to?: RelativePathString;
}

function OtpFormComponent({ otpMeta, phone, return_to }: Props) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  const { onOpen: toast } = useToastStore();

  const verify = async () => {
    if (!otpMeta || loading) return;
    if (!/^\d{4}$/.test(otp)) {
      setError("Enter valid OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await authServices.verifyOTP({
        OTP: otp,
        phone: otpMeta.phone,
        session_id: otpMeta.session_id,
      });

      const data = res.data as SuccessResponse;

      await saveTokens(data.data.access_token, data.data.refresh_token);

      if (!mounted.current) return;
      router.replace(return_to || "/");
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      setError(err.response?.data?.message ?? "");
      if (!err.response) toast("Something went wrong", "error");
    } finally {
      mounted.current && setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <OTPInput codeCount={4} onCodeFilled={setOtp} />

      {/* <ResendButton
        isSubmitting={loading}
        error={error}
        otpMeta={otpMeta}
        phone={phone}
        setError={setError}
        session_id={sessionId}
      /> */}

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button
        loading={loading}
        disabled={loading || otp.length !== 4}
        onPress={verify}
        style={styles.button}
      >
        <Text style={{ fontSize: 17 }}>Verify OTP</Text>
      </Button>
    </View>
  );
}

const OtpForm = memo(OtpFormComponent);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 40,
  },
  error: {
    marginTop: 10,
    color: Colors.destructive,
    fontSize: 13,
  },
  button: {
    height: 60,
    borderRadius: 16,
    marginTop: 30,
  },
});

export default OtpForm;
