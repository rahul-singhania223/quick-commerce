import { Colors } from "@/src/constants/theme";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ImageStyle,
  LayoutChangeEvent,
  StyleSheet,
  View,
  ViewStyle,
  ViewToken,
} from "react-native";

type Banner = {
  id: string;
  image: ImageSourcePropType; // remote URL or local require
};

type Props = {
  data: Banner[];
  autoPlay?: boolean;
  interval?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

export default function ImageSlider({
  data,
  autoPlay = false,
  interval = 3000,
  style,
  imageStyle,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // ----- Track visible item -----
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  // ----- Measure container width -----
  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  if (containerWidth === 0) {
    // Avoid rendering FlatList before we know width
    return <View onLayout={onLayout} />;
  }

  return (
    <>
      <View style={[styles.wrapper, style]} onLayout={onLayout}>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: containerWidth }]}>
              <Image source={item.image} style={[styles.image, imageStyle]} />
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          // viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: containerWidth,
            offset: containerWidth * index,
            index,
          })}
        />
      </View>
      {/* Pagination dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },
  slide: {
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
    padding: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "contain",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: Colors.primary },
});
