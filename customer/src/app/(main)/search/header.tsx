import { ChevronLeft, Search, X } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onBack: () => void;
};

const SearchHeader = ({ value, onChange, onClear, onBack }: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.appBar}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <ChevronLeft size={24} color="#111827" />
      </Pressable>

      <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
        <Search size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        {value.length > 0 && (
          <Pressable onPress={onClear}>
            <X size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: { marginRight: 12 },
  inputContainer: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: "#2DBE60",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
});

export default SearchHeader;
