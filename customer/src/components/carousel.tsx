import React, { useEffect, useRef, useState } from "react";
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
import { Colors } from "../constants/theme";

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

export default function BannerCarousel({
  data,
  autoPlay = true,
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

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // ----- Autoplay -----
  useEffect(() => {
    if (!autoPlay || data.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval, data.length]);

  if (containerWidth === 0) {
    // Avoid rendering FlatList before we know width
    return <View onLayout={onLayout} />;
  }

  return (
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
      {/* Pagination dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  slide: {
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
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
