import { Button } from "@/src/components/ui/button";
import { Colors } from "@/src/constants/theme";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  name: string;
  image: ImageSourcePropType;
  discount?: number;
}

export default function DealProduct({ name, image, discount }: Props) {
  return (
    <View style={styles.container}>
      {discount && <Text style={styles.discount}>-{discount}%</Text>}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Button style={styles.button}>
        <Text style={{ color: Colors.primary }}>Add</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 12,
    width: 170,
    borderRadius: 12,
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
    marginRight: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: "auto",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  textContainer: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
    color: Colors.foreground,
  },
  button: {
    marginTop: 4,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  discount: {
    backgroundColor: Colors.red,
    color: "#fff",
    width: 46,
    paddingVertical: 4,
    textAlign: "center",
    borderRadius: 8,
    fontSize: 12,
    position: "absolute",
    top: 8,
    right: 8,
  }
});
