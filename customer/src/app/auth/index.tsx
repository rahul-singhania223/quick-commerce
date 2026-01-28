import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Colors } from "../../constants/theme";

const { width, height } = Dimensions.get("window");

function AuthForm() {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { onOpen: taost } = useToastStore();

  const handleSubmit = async () => {
    setError("");
    if (phone.length !== 10 || !/^[6-9]\d{9}$/.test(phone)) {
      return setError("Please enter a valid phone number");
    }

    try {
      setIsSubmitting(true);
      const res = await authServices.getOtp(phone);

      const data = res.data as SuccessResponse;

      const { session_id } = data.data;

      return router.push({
        pathname: "/auth/verify",
        params: { session_id, phone },
      });
    } catch (error) {
      const errorDetails = error as AxiosError;
      const errorResponse = errorDetails.response?.data as ErrorResponse;

      if (errorResponse) {
        setError(errorResponse.message);
        return;
      }
      console.log("Something went wrong!", error);

      return taost("Something went wrong!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="never"
      contentContainerStyle={{ width: "100%", marginTop: 80 }}
    >
      <View
        style={{
          backgroundColor: Colors.background,
          flex: 1,
          height: 60,
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: isFocused ? Colors.primary : Colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: Colors.foreground,
            paddingRight: 8,
          }}
        >
          +91
        </Text>
        <Input
          value={phone}
          onChangeText={setPhone}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          placeholder="Eg. 9939878713"
          maxLength={10}
          style={{
            height: 60,
            backgroundColor: "transparent",
            borderWidth: 0,
            color: Colors.foreground,
            marginBottom: 0,
            flex: 1,
            fontSize: 18,
          }}
        />
      </View>

      {!!error && (
        <Text
          style={{
            marginTop: 8,
            color: Colors.destructive,
            fontSize: 13,
            fontWeight: "400",
          }}
        >
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
        }}
      >
        <Text style={{ fontSize: 17 }}>Get Started</Text>
      </Button>
    </ScrollView>
  );
}

import { Keyboard, TouchableWithoutFeedback } from "react-native";
import authServices from "@/src/services/auth.services";
import { ErrorResponse, SuccessResponse } from "@/src/types/types";
import { router } from "expo-router";
import { AxiosError } from "axios";
import { useToastStore } from "@/src/store/toast.store";

export default function AuthScreen() {
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* <Background /> */}

        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              zIndex: 10,
            }}
          >
            <Image
              source={require("@/src/assets/images/logo.png")}
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
            <View style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: "600",
                  textAlign: "center",
                  color: Colors.foreground,
                }}
              >
                Get your delivery started
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  marginTop: 12,
                  color: "#6B7280",
                }}
              >
                Log in to order from nearby stores
              </Text>

              <AuthForm />
            </View>
          </ScrollView>

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
              style={{ color: Colors.blue, textDecorationLine: "underline" }}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={{ color: Colors.blue, textDecorationLine: "underline" }}
            >
              Privacy Policy
            </Text>
          </Text>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
