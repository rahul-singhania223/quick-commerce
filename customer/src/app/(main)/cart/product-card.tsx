import { Colors } from "@/src/constants/theme";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface ProductCartProps {
  name: string;
  brand: string;
  category: string;
  weight: string;
  price: number;
  imageSource: any;
  onPress?: () => void;
}

const ProductCard = ({
  name,
  brand,
  category,
  weight,
  price,
  imageSource,
  onPress,
}: ProductCartProps) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Left: Product Image Box */}
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </View>

      {/* Right: Product Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.brandText}>{brand}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.weight}>{weight}</Text>
        </View>

        <Text style={styles.price}>₹{price}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  imageContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#F3F4F6", // Light gray background to match Frame 142
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    gap: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.mutedForeground,
    textTransform: "uppercase",
  },
  dot: {
    fontSize: 10,
    color: Colors.mutedForeground,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "500",
    color: Colors.mutedForeground,
  },
  nameRow: {
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.foreground,
    flex: 1,
    maxWidth: "80%",
  },
  weight: {
    fontSize: 14,
    color: Colors.mutedForeground,
    // marginLeft: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.foreground,
    marginTop: 2,
  },
});

export default ProductCard;
