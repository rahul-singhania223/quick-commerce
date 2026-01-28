import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    zIndex: 10,
    backgroundColor: "#fff",
    height: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android
  },
});
