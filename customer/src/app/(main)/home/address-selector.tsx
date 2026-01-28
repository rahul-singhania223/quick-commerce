import { Button } from "@/src/components/ui/button";
import { Colors } from "@/src/constants/theme";
import { Address } from "@/src/types/types";
import { CheckCircle2, Circle, MapPin } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const addresses: Address[] = [
  {
    id: "addr_001",
    name: "Home",
    address1: "12 MG Road",
    address2: "Near Metro Station",
    flat_number: "A-302",
    floor: "3",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560001",
  },
  {
    id: "addr_002",
    name: "Office",
    address1: "5th Floor, Tech Park",
    address2: "Outer Ring Road",
    flat_number: "Suite 512",
    floor: "5",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560103",
  },
  {
    id: "addr_003",
    name: "Parents House",
    address1: "48 Park Street",
    address2: "Opposite City Mall",
    flat_number: "B-104",
    floor: "1",
    city: "Kolkata",
    state: "West Bengal",
    zip: "700016",
  },
  {
    id: "addr_004",
    name: "Friend's Place",
    address1: "221B Baker Street",
    address2: "Near Community Center",
    flat_number: "C-12",
    floor: "2",
    city: "Delhi",
    state: "Delhi",
    zip: "110001",
  },
];

interface AddressSelectorProps {}

export default function AddressSelector({}: AddressSelectorProps) {
  const selectedId = "addr_001";

  const onSelect = (id: string) => {};

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      style={styles.container}
    >
      {addresses.map((item) => {
        const isSelected = selectedId === item.id;

        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[styles.addressCard, isSelected && styles.selectedCard]}
          >
            <View style={styles.leftSection}>
              {/* Radio Button Icon */}
              {isSelected ? (
                <CheckCircle2
                  size={20}
                  color={Colors.primary}
                  fill={`${Colors.primary}20`}
                />
              ) : (
                <Circle size={20} color={Colors.border} />
              )}

              <View style={styles.textContainer}>
                <View style={styles.headerRow}>
                  <MapPin size={14} color={Colors.mutedForeground} />
                  <Text style={styles.typeText}>{item.name}</Text>
                </View>
                <Text style={styles.addressText} numberOfLines={2}>
                  {item.address1}, {item.address2}, {item.city}, {item.state}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}

      <Button style={styles.button}>
        <Text style={styles.buttonText}>Add New Address</Text>
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    padding: 16,
    height: "auto",
    borderRadius: 12,
    
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    // shadow-sm logic
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.02)",
    // elevation: 1,
  },
  selectedCard: {
    borderColor: Colors.primary,
    // backgroundColor: `${Colors.primary}20`, // Very light tint of primary
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.foreground,
    textTransform: "uppercase",
  },
  addressText: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
    height: 50,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
  },
});
