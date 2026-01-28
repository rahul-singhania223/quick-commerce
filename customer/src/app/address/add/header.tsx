import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { ChevronLeft, MapPin } from "lucide-react-native";
import { Colors } from "@/src/constants/theme";

interface HeaderProps {
  mode: string;
  onBack: () => void;
  onSave: () => void;
}

export const AddAddressHeader = ({ mode, onBack, onSave } : HeaderProps) => (
  <View style={styles.appBar}>
    <Pressable onPress={onBack} style={styles.backBtn}>
      <ChevronLeft size={24} color="#111827" />
    </Pressable>
    <Text style={styles.title}>
      {mode === "edit" ? "Edit address" : "Add new address"}
    </Text>
    {mode === "edit" && (
      <Pressable onPress={onSave} style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Save</Text>
      </Pressable>
    )}
  </View>
);

interface Props {
  detectedAddress: string;
}

export const MapPicker = ({ detectedAddress } : Props) => (
  <View style={styles.mapContainer}>
    {/* Map Implementation would go here */}
    <View style={styles.mapPlaceholder}>
      <MapPin size={32} color={Colors.primary} />
      <View style={styles.mapPill}>
        <Text style={styles.mapPillText}>Move map to adjust location</Text>
      </View>
    </View>
    <View style={styles.addressPreview}>
      <MapPin size={16} color="#6B7280" />
      <Text style={styles.previewText} numberOfLines={1}>
        {detectedAddress || "Detecting location..."}
      </Text>
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
  title: { fontSize: 16, fontWeight: "600", color: "#111827", flex: 1 },
  saveBtnText: { color: "#2DBE60", fontSize: 14, fontWeight: "600" },
  mapContainer: { margin: 16 },
  mapPlaceholder: {
    height: 220,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  mapPill: {
    position: "absolute",
    bottom: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mapPillText: { color: "#FFFFFF", fontSize: 11 },
  addressPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  previewText: { fontSize: 14, color: "#374151" },
  saveBtn: { marginLeft: 12 },
});
