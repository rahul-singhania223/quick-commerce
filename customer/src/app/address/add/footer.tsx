import { Colors } from "@/src/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  mode: string;
  isValid: boolean;
  onSave: () => void;
}

export const AddAddressFooter = ({ mode, isValid, onSave }: Props) => (
  <View style={styles.footer}>
    <Pressable
      disabled={!isValid}
      style={[styles.saveBtnMain, !isValid && styles.btnDisabled]}
      onPress={onSave}
    >
      <Text style={styles.saveBtnMainText}>
        {mode === "edit" ? "Update address" : "Save address"}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 12,
    paddingHorizontal: 16,
  },
  saveBtnMain: {
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.5 },
  saveBtnMainText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});
