import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AddAddressHeader, MapPicker } from "./header";
import { AddressForm } from "./addressForm";
import { AddAddressFooter } from "./footer";


interface AddAddressScreenProps {
  navigation: any;
  route: any;
}

export default function AddAddress({
  navigation,
  route,
}: AddAddressScreenProps) {
  // 1. Route locking and Mode detection
  const mode = route.params?.mode || "add";
  const [detectedLocation, setDetectedLocation] = useState(
    "Near Green Park, New Delhi",
  );

  // 2. Form State (simplified for UI demo)
  const [formData, setFormData] = useState({
    house: "",
    area: "",
    pincode: "",
    name: "",
    phone: "",
  });

  // 3. Validation Logic for Sticky CTA
  const isFormValid = useMemo(() => {
    return (
      formData.house.length > 0 &&
      formData.area.length > 0 &&
      formData.pincode.length === 6 &&
      formData.name.length > 0 &&
      formData.phone.length === 10
    );
  }, [formData]);

  const handleSave = () => {
    // Logic to save address via Prisma/API
    navigation.goBack();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* 1. App Bar */}
        <AddAddressHeader
          mode={mode}
          onBack={() => navigation.goBack()}
          onSave={handleSave}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 2 & 3. Map Picker & Location Preview */}
            <MapPicker detectedAddress={detectedLocation} />

            {/* 4, 5 & 6. Address Details Form */}
            <View style={styles.formSection}>
              <AddressForm
                values={formData}
                onChange={(key, val) =>
                  setFormData({ ...formData, [key]: val })
                }
              />
            </View>
          </ScrollView>

          {/* 8. Sticky Bottom CTA */}
          <AddAddressFooter
            mode={mode}
            isValid={isFormValid}
            onSave={handleSave}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formSection: {
    // Separator between map and form details
    marginTop: 8,
  },
});
