import { Alert } from "react-native";

interface DeleteConfirmOptions {
  title?: string;
  message?: string;
  onConfirm: () => void;
}

export const showDeleteConfirm = ({
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.",
  onConfirm,
}: DeleteConfirmOptions) => {
  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: onConfirm },
  ]);
};
