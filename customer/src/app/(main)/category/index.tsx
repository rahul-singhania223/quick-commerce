import Header from "@/src/components/header";
import { products } from "@/src/constants/dummy";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../home/product-card";
import FilterBar from "./filter-bar";
import SelectionModal from "./selection-modal";

export default function Category() {
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Snacks" actionType="cart" />
        <FilterBar
          onOpenSort={() => setSortVisible(true)}
          onOpenFilter={() => setFilterVisible(true)}
        />

        {/* Sort Modal */}
        <SelectionModal
          visible={sortVisible}
          onClose={() => setSortVisible(false)}
          title="Sort By"
        >
          <View>
            <Text>Sort By</Text>
          </View>
        </SelectionModal>

        {/* Filter Modal */}
        <SelectionModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          title="Filter"
        >
          <View>
            <Text>Filter By</Text>
          </View>
        </SelectionModal>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.container}
        >
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
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 120,
    // backgroundColor: "#000",
  },
  products: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    marginBottom: 40,
  },
});
