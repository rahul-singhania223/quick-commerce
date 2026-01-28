import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import SearchHeader from "./header";
import RecentSearch from "./recent";
import { product } from "@/src/constants/dummy";
import SearchEmptyState from "./empty-state";
import ProductPreviewCard from "./product-preview-card";

export default function Search() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {/* header */}
        <SearchHeader
          value="iPhone 14"
          onChange={() => {}}
          onClear={() => {}}
          onBack={() => {}}
        />

        {/* recent search */}
        {/* <RecentSearch /> */}

        {/* products */}
        {/* <ProductPreviewCard
          name={product.name}
          price={product.price}
          image={product.images[0].image}
          onAdd={() => {}}
        /> */}

        <SearchEmptyState onRetry={() => {}} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
