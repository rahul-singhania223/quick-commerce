import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  ChevronLeft,
  Plus,
  MoreVertical,
  AlertCircle,
} from "lucide-react-native";

type Props = {
  onBack: () => void;
};

const AddressesHeader = ({ onBack } : Props) => (
  <View style={styles.appBar}>
    <Pressable onPress={onBack} style={styles.backBtn}>
      <ChevronLeft size={24} color="#111827" />
    </Pressable>
    <Text style={styles.title}>My addresses</Text>
  </View>
);

const styles = StyleSheet.create({
  appBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: { marginRight: 12 },
  title: { fontSize: 20, fontWeight: "600", color: "#111827" },
});

export default AddressesHeader;