import { Colors } from "@/src/constants/theme";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface CategoryProps {
  name: string;
  image: ImageSourcePropType;
  style?: ViewStyle;
  imageStyle?: ViewStyle;
}

export default function Category({ name, image, style, imageStyle }: CategoryProps) {
  return (
    <Pressable style={[styles.container, style]}>
      <View style={[styles.imageContainer, imageStyle]}>
        <Image style={styles.image} source={image} />
      </View>
      <Text style={styles.text}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 12,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    padding: 6,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  text: {
    fontSize: 14,
    fontWeight: "medium",
  },
});
