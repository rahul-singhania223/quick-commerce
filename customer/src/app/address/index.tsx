import Header from "@/src/components/header";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AddressCard, { AddAddressButton } from "./addressCard";
import DeleteAddressConfirm from "./deleteConfirm";
import AddressEmptyState from "./emptyState";

// Mock Data - In a real app, this comes from your Prisma/API layer
const MOCK_ADDRESSES = [
  {
    id: "1",
    label: "Home",
    name: "Ankit Kumar",
    fullAddress:
      "Flat 402, Green Valley Apartments, Sector 45, Gurgaon, HR - 122003",
    phone: "+91 98765 43210",
    isDefault: true,
    isServiceable: true,
  },
  {
    id: "2",
    label: "Work",
    name: "Ankit Kumar",
    fullAddress:
      "Cyber Hub, Building 10C, 4th Floor, DLF Phase 2, Gurgaon, HR - 122002",
    phone: "+91 98765 43210",
    isDefault: false,
    isServiceable: true,
  },
  {
    id: "3",
    label: "Other",
    name: "Ankit Kumar",
    fullAddress: "12/A, Old Town Road, Near Metro Station, New Delhi - 110001",
    phone: "+91 98765 43210",
    isDefault: false,
    isServiceable: false, // Triggers the "Not Serviceable" UI state
  },
  {
    id: "4",
    label: "Other",
    name: "Ankit Kumar",
    fullAddress: "12/A, Old Town Road, Near Metro Station, New Delhi - 110001",
    phone: "+91 98765 43210",
    isDefault: false,
    isServiceable: false, // Triggers the "Not Serviceable" UI state
  },
  {
    id: "5",
    label: "Other",
    name: "Ankit Kumar",
    fullAddress: "12/A, Old Town Road, Near Metro Station, New Delhi - 110001",
    phone: "+91 98765 43210",
    isDefault: false,
    isServiceable: false, // Triggers the "Not Serviceable" UI state
  },
];

export default function AddressesScreen({ navigation }: any) {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const handleAddNew = () => {
    navigation.navigate("AddAddress"); // Navigate to dedicated form screen
  };

  const handleEdit = (address: any) => {
    navigation.navigate("EditAddress", { addressId: address.id }); //
  };

  const openDeleteConfirm = (address: any) => {
    setSelectedAddress(address);
    setShowDeleteSheet(true);
  };

  const confirmDelete = () => {
    setAddresses((prev) => prev.filter((a) => a.id !== selectedAddress.id));
    setShowDeleteSheet(false);
    setSelectedAddress(null);
  };

  return (
    <SafeAreaProvider>
      <Header title="Addresses" actionType="notification" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {addresses.length > 0 && <AddAddressButton onPress={handleAddNew} />}

          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AddressCard
                item={item}
                onMenuPress={() => openDeleteConfirm(item)}
              />
            )}
            ListEmptyComponent={<AddressEmptyState onAdd={handleAddNew} />}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        {/* 7B. Delete Confirmation Bottom Sheet */}
        <Modal
          visible={showDeleteSheet}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDeleteSheet(false)}
          presentationStyle="overFullScreen"
          statusBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <View style={styles.sheetContainer}>
              <DeleteAddressConfirm
                onCancel={() => setShowDeleteSheet(false)}
                onDelete={confirmDelete}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingBottom: 20,
    width: "100%",
  },
});
