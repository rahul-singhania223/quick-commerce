import { memo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Colors } from "@/src/constants/theme";
import authServices from "@/src/services/auth.services";
import { useToastStore } from "@/src/store/toast.store";
import { ErrorResponse, SuccessResponse } from "@/src/types/types";
import { AxiosError } from "axios";
import { router } from "expo-router";

function AuthFormComponent() {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const { onOpen: toast } = useToastStore();

  const submit = async () => {
    if (loading) return;

    setError("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await authServices.getOtp(phone);
      const data = res.data as SuccessResponse;

      router.push({
        pathname: "/auth/verify",
        params: { session_id: data.data.session_id, phone },
      });
    } catch (e) {
      const err = e as AxiosError<ErrorResponse>;
      setError(err.response?.data?.message ?? "");
      if (!err.response) toast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputBox, focused && styles.focused]}>
        <Text style={styles.prefix}>+91</Text>

        <Input
          value={phone}
          onChangeText={setPhone}
          keyboardType="number-pad"
          maxLength={10}
          placeholder="Eg. 9939878713"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button
        loading={loading}
        disabled={loading}
        onPress={submit}
        style={styles.button}
      >
        <Text style={{ fontSize: 17 }}>Get Started</Text>
      </Button>
    </View>
  );
}

export const AuthForm = memo(AuthFormComponent);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 40,
  },

  inputBox: {
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  focused: {
    borderColor: Colors.primary,
  },

  prefix: {
    fontSize: 18,
    color: Colors.foreground,
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: "100%",
    borderWidth: 0,
    backgroundColor: "transparent",
    fontSize: 18,
    marginBottom: 0,
  },

  error: {
    marginTop: 8,
    color: Colors.destructive,
    fontSize: 13,
  },

  button: {
    height: 60,
    borderRadius: 16,
    marginTop: 40,
  },
});
