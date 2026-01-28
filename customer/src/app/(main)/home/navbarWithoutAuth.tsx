import { Button } from "@/src/components/ui/button";
import { Link } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function NavbarWithoutAuth() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={"/home"} style={styles.logo}>
          <Image
            source={require("@/src/assets/images/logo.png")}
            style={styles.logoImage}
          />
        </Link>

        <Button>Register/Login</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
    zIndex: 10,
    backgroundColor: "#fff",
    height: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android
  },

  logo: {
    width: 100,
    height: 32,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});
