import { product } from "@/src/constants/dummy";
import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FilterSortBar from "./filter-sort-bar";
import Header from "./header";
import SearchResultCard from "./result-card";
import SearchResultSkeleton from "./result-skeleton";

export default function SearchResult() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          query="iPhone 14"
          onBack={() => {}}
          onChange={() => {}}
          onClear={() => {}}
        />
        <FilterSortBar
          activeFilter="Brand"
          onFilterPress={() => {}}
          onSortPress={() => {}}
        />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <SearchResultCard item={product} onAdd={() => {}} />
          <SearchResultCard item={product} onAdd={() => {}} />
          <SearchResultCard item={product} onAdd={() => {}} />
          <SearchResultCard item={product} onAdd={() => {}} />
{/* 
            <SearchResultSkeleton />
            <SearchResultSkeleton /> */}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
