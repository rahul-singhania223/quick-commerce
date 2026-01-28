import { Colors } from "@/src/constants/theme";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription = ({
  description,
}: ProductDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>About this item</Text>

      <View style={styles.contentWrapper}>
        <Text
          style={styles.description}
          numberOfLines={isExpanded ? undefined : 3}
        >
          {description}
        </Text>

        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.readMoreBtn}
        >
          <Text style={styles.readMoreText}>{isExpanded ? "Less" : "Read more"}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 4, // Aligns with the overall content padding
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.foreground,
    marginBottom: 8,
  },
  contentWrapper: {
    gap: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
    fontWeight: "400",
  },
  readMoreBtn: {
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.blue, // Using your blue hex: #3b82f6
  },
});

export default ProductDescription;