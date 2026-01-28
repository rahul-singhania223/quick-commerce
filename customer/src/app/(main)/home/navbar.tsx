import { Colors } from "@/src/constants/theme";
import { useModal } from "@/src/store/modal.store";
import { Bell, ChevronDown, MapPin } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AddressSelector from "./address-selector";
import { useToastStore } from "@/src/store/toast.store";

const addressOptions = [
  {
    label: "Address1",
    value: "Address1",
  },
  {
    label: "Address2",
    value: "Address2",
  },
];
export default function Navbar() {
  const { onOpen } = useModal();

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.address}>
          <MapPin size={14} fill={"white"} stroke={Colors.primary} />
          <Text style={styles.addressText}>Deliver to:</Text>
          <Pressable
            onPress={() => onOpen("Select Address", <AddressSelector />)}
            style={({ pressed }) => [
              styles.addressDropdownTrigger,
              pressed && { backgroundColor: Colors.muted, borderRadius: 8 },
            ]}
          >
            <Text style={styles.addressValue}>Delhi NCR</Text>
            <ChevronDown size={15} color={Colors.mutedForeground} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => onOpen("Notification", <View></View>)}
          style={({ pressed }) => [
            pressed && {
              backgroundColor: Colors.muted,
            },
            { borderRadius: 50, padding: 8 },
          ]}
        >
          <View style={styles.notification}>
            <Bell size={21} color={Colors.foreground} strokeWidth={1.8} />
            <View
              style={{
                width: 7,
                height: 7,
                backgroundColor: "red",
                borderRadius: 50,
                position: "absolute",
                top: 1,
                right: 1,
              }}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
    zIndex: 10,
    backgroundColor: "#fff",
    height: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressText: {
    fontSize: 12,
    fontWeight: "light",
    color: Colors.mutedForeground,
  },
  addressDropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  addressValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.foreground,
    marginLeft: 4,
  },
  notification: {
    position: "relative",
  },
});
