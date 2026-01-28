import { BottomNav } from "@/src/components/bottom-nav";
import BannerCarousel from "@/src/components/carousel";
import { CartBar } from "@/src/components/cart-bar";
import { categories, products } from "@/src/constants/dummy";
import { Colors } from "@/src/constants/theme";
import { Search } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Category from "./category";
import DealProduct from "./deal-product";
import Navbar from "./navbar";
import ProductCard from "./product-card";
import NavbarWithoutAuth from "./navbarWithoutAuth";
import { useAuthStore } from "@/src/store/auth.store";

export default function HomeScreen() {
  const { status } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      {status === "authenticated" ? <Navbar /> : <NavbarWithoutAuth />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          flex: 1,
          paddingTop: 40,
          paddingBottom: 40,
          paddingHorizontal: 16,
          marginBottom: status === "authenticated" ? 120 : 0,
        }}
      >
        <Pressable style={styles.searchButton}>
          <Search size={20} color={Colors.mutedForeground} />
          <Text style={styles.searchButtonText}>
            Search for "Milk, Bread, Vegetables"
          </Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((cat, i) => (
            <Category key={i} name={cat.name} image={cat.image} />
          ))}
        </ScrollView>

        <BannerCarousel
          data={[
            { id: "1", image: require("@/src/assets/images/banners/1.png") },
            { id: "2", image: require("@/src/assets/images/banners/1.png") },
            { id: "3", image: require("@/src/assets/images/banners/1.png") },
          ]}
          style={styles.banner}
        />

        <View style={styles.secondCategoryContainer}>
          {categories.map(
            (cat, i) =>
              i < 6 && (
                <Category
                  imageStyle={styles.secondCategoryImage}
                  style={styles.secondCategory}
                  key={i}
                  name={cat.name}
                  image={cat.image}
                />
              ),
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeaderText}>Today's Deals</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.deals}
          >
            <DealProduct
              name="Lays Fresh Chips, One Packet, 10g"
              image={require("@/src/assets/images/category/snacks.png")}
              discount={12}
            />
            <DealProduct
              name="Fresh Hens Eggs, One Dozen, 12pcs"
              image={require("@/src/assets/images/category/eggs.png")}
              discount={12}
            />
            <DealProduct
              name="Lays Fresh Chips, One Packet, 10g"
              image={require("@/src/assets/images/category/snacks.png")}
              discount={12}
            />
            <DealProduct
              name="Fresh Hens Eggs, One Dozen, 12pcs"
              image={require("@/src/assets/images/category/eggs.png")}
              discount={12}
            />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeaderText}>Recommended For You</Text>
          <View style={styles.products}>
            {products.map((product) => (
              <ProductCard
                key={product.name}
                name={product.name}
                brand={product.brand}
                category={product.category}
                weight={product.weight}
                price={product.price}
                image={product.image}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      {/* <BottomNav /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  searchButton: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.muted,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  searchButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.mutedForeground,
  },

  categoryContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexGrow: 0,
    marginTop: 32,
  },
  banner: {
    width: "100%",
    height: 180,
    marginTop: 32,
    borderRadius: 12,
    overflow: "hidden",
  },

  secondCategoryContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 32,
  },

  secondCategory: {
    width: "31%",
    marginBottom: 16,
    backgroundColor: "#fff",
    marginRight: 0,
    padding: 8,
    borderRadius: 12,
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.02)",
  },

  secondCategoryImage: {
    width: "100%",
    objectFit: "contain",
    borderWidth: 0,
  },

  section: {
    marginTop: 40,
    color: Colors.foreground,
    // backgroundColor: "black",
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    color: Colors.foreground,
  },
  deals: {},
  products: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    marginBottom: 40,
  },
});
