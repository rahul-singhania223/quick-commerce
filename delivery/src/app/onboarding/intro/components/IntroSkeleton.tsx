import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const IntroSkeleton = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={[styles.skeleton, { width: 32, height: 32, borderRadius: 6 }]}
        />
        <View
          style={[styles.skeleton, { width: 150, height: 16, marginLeft: 12 }]}
        />
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.skeleton,
            { width: "80%", height: 24, marginBottom: 12 },
          ]}
        />
        <View
          style={[
            styles.skeleton,
            { width: "60%", height: 24, marginBottom: 40 },
          ]}
        />
        <View
          style={[
            styles.skeleton,
            { width: "90%", height: 14, marginBottom: 16 },
          ]}
        />
        <View
          style={[
            styles.skeleton,
            { width: "90%", height: 14, marginBottom: 16 },
          ]}
        />
        <View style={[styles.skeleton, { width: "90%", height: 14 }]} />
      </View>
      <View style={styles.footer}>
        <View
          style={[
            styles.skeleton,
            { width: "100%", height: 56, borderRadius: 14 },
          ]}
        />
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  content: { flex: 1, padding: 16, paddingTop: 32 },
  footer: { padding: 16, paddingBottom: 24 },
  skeleton: { backgroundColor: "#F3F4F6" },
});

export default IntroSkeleton;
