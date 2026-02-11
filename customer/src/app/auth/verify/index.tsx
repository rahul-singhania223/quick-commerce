import { OTPInput } from "@/src/components/otp-input";
import ScreenLoader from "@/src/components/screenLoader";
import { Button } from "@/src/components/ui/button";
import { Colors } from "@/src/constants/theme";
import authServices from "@/src/services/auth.services";
import { ErrorResponse, OtpMeta, SuccessResponse } from "@/src/types/types";
import { LinearGradient } from "expo-linear-gradient";
import {
  Link,
  RelativePathString,
  router,
  useLocalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ResendButton from "./resend-button";
import { AxiosError } from "axios";
import { saveTokens } from "@/src/utils/token.utils";
import { useToastStore } from "@/src/store/toast.store";

const { width, height } = Dimensions.get("window");

function Background() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(252,205,238,0.5)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          width,
          height,
          transform: [{ rotate: "180deg" }],
        }}
      />
    </View>
  );
}

interface OtpFormProps {
  session_id: string;
  phone: string;
  return_to?: RelativePathString;
  otpMeta: OtpMeta | null;
}

function OtpForm({ session_id, phone, otpMeta, return_to }: OtpFormProps) {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { onOpen: toast } = useToastStore();

  const handleSubmit = async () => {
    if (!otpMeta) return;
    if (isSubmitting) return;
    if (!phone) return setError("Phone number is required!");

    setError("");
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      return setError("Invalid OTP!");
    }

    try {
      setIsSubmitting(true);

      const res = await authServices.verifyOTP({
        OTP: otp,
        phone: otpMeta.phone,
        session_id: otpMeta.session_id,
      });

      const data = res.data as SuccessResponse;

      const { access_token, refresh_token, user } = data.data;

      // save tokens
      await saveTokens(access_token, refresh_token);

      // push successfull auth
      return router.push(return_to || "/");
    } catch (error) {
      const errorDetails = error as AxiosError;
      const errorResponse = errorDetails.response?.data as ErrorResponse;

      if (errorResponse) {
        setError(errorResponse.message);
        return;
      }
      console.log("Something went wrong!", error);

      return toast("Something went wrong!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="never"
      contentContainerStyle={{ width: "100%", marginTop: 80 }}
    >
      <OTPInput codeCount={4} onCodeFilled={(code) => setOtp(code)} />
      <ResendButton
        isSubmitting={isSubmitting}
        error={error}
        otpMeta={otpMeta}
        phone={phone}
        session_id={session_id}
        setError={setError}
      />
      {!!error && (
        <Text style={{ marginTop: 8, color: Colors.destructive, fontSize: 13 }}>
          {error}
        </Text>
      )}

      <Button
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit}
        variant={"default"}
        style={{
          height: 60,
          borderRadius: 16,
          marginTop: 80,
          marginBottom: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 17 }}>Verify OTP</Text>
      </Button>
    </ScrollView>
  );
}

export default function VerificationScreen() {
  const { phone, session_id, return_to } = useLocalSearchParams<{
    phone: string;
    session_id: string;
    return_to?: string;
  }>();

  const [globalError, setGlobalError] = useState<null | string>(null);
  const [otpMeta, setOtpMeta] = useState<OtpMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOtpMeta = async () => {
      try {
        setLoading(true);
        if (!session_id || !phone)
          return setGlobalError("Session ID & Phone are required!");
        const res = await authServices.getOtpMetaData({ session_id, phone });
        const resData = res.data as SuccessResponse;
        setOtpMeta(resData.data as OtpMeta);
      } catch (error) {
        const errorData = error as ErrorResponse;
        setGlobalError(errorData.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getOtpMeta();
  }, [session_id, phone]);

  if (loading) return <ScreenLoader />;

  // if (globalError) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         padding: 20,
  //       }}
  //     >
  //       <View>
  //         <Text
  //           style={{
  //             fontSize: 20,
  //             fontWeight: "700",
  //             marginBottom: 40,
  //             textAlign: "center",
  //             color: Colors.red,
  //           }}
  //         >
  //           {globalError}
  //         </Text>

  //         <Button
  //           onPress={() => router.push("/auth")}
  //           style={{ height: 60, borderRadius: 12 }}
  //         >
  //           <Text>Get New OTP</Text>
  //         </Button>
  //       </View>
  //     </View>
  //   );
  // }
  return (
    <Pressable
      onPress={Keyboard.dismiss}
      accessible={false}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              right: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              zIndex: 10,
            }}
          >
            <Image
              source={require("../../../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              justifyContent: "flex-end",
            }}
          >
            <View style={{ width: "100%", marginBottom: 40 }}>
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: "600",
                  textAlign: "center",
                  color: Colors.foreground,
                }}
              >
                Verify OTP
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginTop: 14,
                  marginBottom: 12,
                  color: Colors.mutedForeground,
                }}
              >
                4 digit OTP has been sent to your mobile number 9939878713
              </Text>

              <Link href={"/auth"}>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    color: Colors.blue,
                    textDecorationLine: "underline",
                  }}
                >
                  Change
                </Text>
              </Link>

              <OtpForm
                session_id={session_id}
                phone={phone}
                otpMeta={otpMeta}
              />
              {/* Bottom text */}
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.light.muted,
                  fontSize: 12,
                  opacity: 0.5,
                  paddingHorizontal: 20,
                  paddingBottom: 0,
                }}
              >
                By continuing, you agree to our{" "}
                <Text
                  style={{
                    color: Colors.blue,
                    textDecorationLine: "underline",
                  }}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={{
                    color: Colors.blue,
                    textDecorationLine: "underline",
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 110,
    height: 60,
    objectFit: "contain",
    marginRight: 4,
  },
});
