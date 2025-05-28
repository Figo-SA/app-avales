import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

const LogoutIconButton = () => {
  const { logout } = useAuthStore();
  return (
    <TouchableOpacity
      style={{
        marginRight: 10,
      }}
    >
      <Ionicons
        name="log-out-outline"
        size={22}
        color={Colors.light.primary}
        onPress={logout}
      />
    </TouchableOpacity>
  );
};

export default LogoutIconButton;
