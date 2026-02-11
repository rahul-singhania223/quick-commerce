import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";
import { AuthForm } from "./components/AuthForm";

export default function AuthScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.container}
            >
              {/* Header */}
              <Image
                source={require("@/src/assets/images/logo.png")}
                style={styles.logo}
              />

              {/* Content */}
              <View style={styles.center}>
                <Text style={styles.title}>Get your delivery started</Text>
                <Text style={styles.subtitle}>
                  Log in to order from nearby stores
                </Text>

                <AuthForm />
              </View>

              {/* Footer */}
              <Text style={styles.footer}>
                By continuing, you agree to our{" "}
                <Text style={styles.link}>Terms of Service</Text> and{" "}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "space-between",
  },

  logo: {
    width: 110,
    height: 60,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },

  center: {
    marginTop: 40,
  },

  title: {
    fontSize: 38,
    fontWeight: "600",
    textAlign: "center",
    color: Colors.foreground,
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 12,
    color: "#6B7280",
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.5,
    color: Colors.light.muted,
    marginTop: 30,
  },

  link: {
    color: Colors.blue,
    textDecorationLine: "underline",
  },
});
