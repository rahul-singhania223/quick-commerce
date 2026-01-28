import { Button } from "@/src/components/ui/button";
import { Colors } from "@/src/constants/theme";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface ProductCardProps {
  image: ImageSourcePropType;
  brand: string;
  category: string;
  name: string;
  weight: string;
  price: number;
  onPress?: () => void;
  onAdd?: () => void;
  style?: ViewStyle;
}

export default function ProductCard({
  image,
  brand,
  category,
  name,
  weight,
  price,
  onPress,
  onAdd,
  style,
}: ProductCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.details}>
        {/* Brand & Category */}
        <Text style={styles.metaText}>
          {brand} • {category}
        </Text>

        {/* Product Name */}
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>

        {/* Weight/Quantity */}
        <Text style={styles.weight}>{weight}</Text>

        {/* Footer: Price & Add Button */}
        <View style={styles.footer}>
          <Text style={styles.price}>₹{price}</Text>
          <Button onPress={onAdd} style={styles.addButton} size="sm">
            <Text style={styles.buttonText}>Add</Text>
          </Button>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 170,
    width: "48%", // Standard width for recommendation cards
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: "90%",
    height: "90%",
    objectFit: "contain",
  },
  details: {
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    textTransform: "uppercase",
    color: Colors.mutedForeground,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.foreground,
    lineHeight: 20,
  },
  weight: {
    fontSize: 13,
    color: Colors.mutedForeground,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto", // Pushes footer to bottom
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.foreground,
  },
  addButton: {
    width: 70,
    height: 36,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  buttonText: {
    color: Colors.primary,
  },
});
