import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import React from "react";

type Props = {
  name: string;
  price: number;
  image: ImageSourcePropType;
  onAdd: () => void;
};

const ProductPreviewCard = ({ name, price, image, onAdd }: Props) => (
  <View style={styles.miniCard}>
    <Image source={image} style={styles.miniImg} />
    <View style={styles.miniInfo}>
      <Text style={styles.miniName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.miniPrice}>₹{price}</Text>
    </View>
    <Pressable style={styles.miniAddBtn} onPress={onAdd}>
      <Text style={styles.miniAddText}>Add</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  miniCard: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
  },
  miniImg: { width: 48, height: 48, borderRadius: 8 },
  miniInfo: { flex: 1, marginLeft: 12 },
  miniName: { fontSize: 13, color: "#111827" },
  miniPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },
  miniAddBtn: {
    height: 28,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#2DBE60",
    justifyContent: "center",
  },
  miniAddText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
});

export default ProductPreviewCard;
