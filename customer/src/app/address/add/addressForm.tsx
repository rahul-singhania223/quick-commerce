import { Pressable, StyleSheet, Switch } from "react-native";
import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/src/constants/theme";

const InputField = ({ placeholder, keyboardType = 'default', error }: any) => (
  <View style={styles.inputWrapper}>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      style={[styles.input, error && styles.inputError]}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

interface Props {
    values?: any
    onChange: (key: string, value: any) => void
}

export const AddressForm = ({ values, onChange }: Props) => {
  const [label, setLabel] = useState('Home');

  return (
    <ScrollView style={styles.formScroll}>
      <Text style={styles.sectionTitle}>Address details</Text>
      <InputField placeholder="Flat, House no., Building" />
      <InputField placeholder="Area, Street, Sector" />
      <InputField placeholder="Nearby landmark (optional)" />
      <InputField placeholder="Pincode" keyboardType="numeric" />
      
      <View style={styles.row}>
        <View style={{ flex: 1 }}><InputField placeholder="Name" /></View>
        <View style={{ flex: 1 }}><InputField placeholder="Phone number" keyboardType="numeric" /></View>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Save as</Text>
      <View style={styles.chipRow}>
        {['Home', 'Work', 'Other'].map((item) => (
          <Pressable
            key={item} 
            onPress={() => setLabel(item)}
            style={[styles.chip, label === item && styles.chipActive]}
          >
            <Text style={[styles.chipText, label === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Set as default address</Text>
        <Switch value={false} trackColor={{ true: Colors.primary }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formScroll: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: '#111827', marginBottom: 8 },
  inputWrapper: { marginBottom: 12 },
  input: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },
  inputError: { borderWidth: 1, borderColor: '#DC2626' },
  errorText: { color: '#DC2626', fontSize: 11, marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: { height: 32, paddingHorizontal: 16, borderRadius: 16, backgroundColor: '#F7F8FA', justifyContent: 'center' },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: 13, color: '#374151' },
  chipTextActive: { color: '#FFFFFF' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  toggleText: { fontSize: 14, color: '#374151' },
});