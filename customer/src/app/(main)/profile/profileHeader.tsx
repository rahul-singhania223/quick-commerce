import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileHeader = () => (
  <View style={styles.appBar}>
    <Text style={styles.title}>Profile</Text>
  </View>
);

const styles = StyleSheet.create({
  appBar: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "600", color: "#111827" },
});

export default ProfileHeader;