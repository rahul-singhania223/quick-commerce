import Header from "@/src/components/header";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import QuickActions from "./quickAction";
import UserInfoCard from "./userInfoCard";

export default function Profile() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="" actionType="none" />

        <UserInfoCard
          name="Rahul Singhania"
          contact="+91 1234567890"
          onEdit={() => {}}
        />
        <QuickActions onNavigate={() => {}} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
