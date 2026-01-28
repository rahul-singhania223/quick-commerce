import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { ChevronLeft, X } from "lucide-react-native";

interface Props {
    query: string;
    onBack: () => void;
    onChange: (text: string) => void;
    onClear: () => void;
}

const Header = ({ query, onBack, onChange, onClear } : Props) => (
  <View style={styles.appBar}>
    <Pressable onPress={onBack} style={styles.backBtn}>
      <ChevronLeft size={24} color="#111827" />
    </Pressable>

    <View style={styles.inputWrapper}>
      <TextInput
        value={query}
        onChangeText={onChange}
        placeholder="Search products..."
        style={styles.inputField}
      />
      {query.length > 0 && (
        <Pressable onPress={onClear}>
          <X size={18} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  appBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: { marginRight: 12 },
  inputWrapper: {
    flex: 1,
    height: 40,
    backgroundColor: "#F7F8FA",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  inputField: { flex: 1, fontSize: 14, color: "#111827" },
});

export default Header;