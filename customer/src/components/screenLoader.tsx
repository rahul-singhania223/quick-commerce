import { Image, View } from "react-native";

import { Loader2 } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

interface CircleLoaderProps {
  size?: number;
  color?: string;
}

const CircleLoader = ({ size = 24, color = `${Colors.primary}80` }: CircleLoaderProps) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Loader2 size={size} color={color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function ScreenLoader() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("@/src/assets/images/logo.png")}
        style={{ width: 150, height: 40, objectFit: "contain", marginBottom: 20 }}
      />
      <CircleLoader />
    </View>
  );
}
