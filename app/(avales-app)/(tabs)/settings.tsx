import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { StyleSheet, Text, View } from "react-native";

export default function Tab() {
  const { logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
      <Text onPress={logout} style={{ color: "blue", marginTop: 20 }}>
        Logout
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
