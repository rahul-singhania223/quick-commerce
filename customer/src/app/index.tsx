import { Redirect, router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/button";
import { Colors } from "../constants/theme";
import { useAuthStore } from "../store/auth.store";

export default function Landing() {
  const { status } = useAuthStore();

  if (status === "authenticated") return <Redirect href={"/home"} />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        position: "relative",
        backgroundColor: "#ffff",
      }}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("@/src/assets/images/logo.png")}
        />
      </View>

      <View style={styles.heroContainer}>
        <Image
          style={styles.heroImage}
          source={require("@/src/assets/images/hero.png")}
        />
        <Text style={styles.heroText}>You Wish, We Deliver!</Text>

        <View style={styles.btnContainer}>
          <Button onPress={() => router.push("/auth")} style={styles.ctaButton}>
            <Text style={styles.ctaText}>Register/Login</Text>
          </Button>
          <Button
            onPress={() => router.push("/home")}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip For Now</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  logo: {
    width: 110,
    height: 40,
    objectFit: "contain",
  },
  heroContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    width: 300,
    height: 300,
    objectFit: "contain",
  },
  heroText: {
    fontSize: 38,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  btnContainer: {
    marginTop: 60,
    gap: 12,
    width: "100%",
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 60,
    borderRadius: 12,
  },
  skipButton: {
    width: "100%",
    height: 60,
    borderRadius: 12,
    backgroundColor: `${Colors.muted}50`,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "500",
  },
  skipText: {
    color: Colors.foreground,
    fontWeight: "400",
  },
});
