import { Colors } from "@/src/constants/theme";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NavbarWithoutAuth() {
  return (
    <View style={styles.container}>
      <Link href={"/home"}>
        <TouchableOpacity>
          <Image
            style={styles.logo}
            source={require("@/src/assets/images/logo.png")}
          />
        </TouchableOpacity>
      </Link>

      <Link href={"/auth"}>
        <TouchableOpacity>
          <Text style={styles.actionText}>Sign In</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: { width: 100, height: 28, objectFit: "contain" },
  actionText: { fontSize: 14, fontWeight: "500", color: Colors.primary },
});
