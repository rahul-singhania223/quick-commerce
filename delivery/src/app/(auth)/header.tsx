import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface BrandHeaderProps {
  valueProp: string;
}

const BrandHeader = ({ valueProp }: BrandHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoPlaceholder}>
        {/* Replace with actual logo source */}
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.valueProp}>{valueProp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 150,
    height: 50,
    borderRadius: 8,
    marginBottom: 12,
    objectFit: "contain",
    marginHorizontal: "auto",
  },
  valueProp: {
    fontSize: 16,
    fontWeight: "500", // Medium
    color: "#374151",
  },
  logoPlaceholder: {
    
  },
});

export default BrandHeader;
