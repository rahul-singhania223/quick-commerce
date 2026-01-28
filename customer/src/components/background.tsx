import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Background() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(252,205,238,0.5)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          width,
          height,
          transform: [{ rotate: "180deg" }],
        }}
      />
    </View>
  );
}
