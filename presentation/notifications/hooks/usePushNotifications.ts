import { updatePushToken } from "@/core/user/actions/user-actions";
import { toast } from "@backpackapp-io/react-native-toast";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  console.error("Push Notification Error:", errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    handleRegistrationError(
      "Debe usar un dispositivo físico para notificaciones push"
    );
    return null;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("⚠️ Usuario rechazó los permisos de notificaciones");
      handleRegistrationError("Permisos de notificaciones no otorgados");
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError("Project ID no encontrado");
      return null;
    }

    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    return pushTokenString;
  } catch (error: any) {
    handleRegistrationError(`Error al obtener push token: ${error}`);
    return null;
  }
}

let areListenersReady = false;

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    Notifications.Notification[]
  >([]);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "checking" | "granted" | "denied" | "unknown"
  >("checking");

  const notificationListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );
  const responseListener = useRef<Notifications.Subscription | undefined>(
    undefined
  );

  // Registrar para notificaciones push
  useEffect(() => {
    let isMounted = true;

    const register = async () => {
      setIsRegistering(true);
      setPermissionStatus("checking");

      try {
        const token = await registerForPushNotificationsAsync();

        if (!isMounted) return;

        if (token) {
          setExpoPushToken(token);
          setPermissionStatus("granted");

          // Enviar token al backend
          try {
            await updatePushToken(token);
          } catch (error) {
            console.error("Error al enviar push token al backend:", error);
            // No mostramos toast de error para no molestar al usuario
          }
        } else {
          setPermissionStatus("denied");
        }
      } catch (error) {
        console.error("Error en registro de notificaciones:", error);
        setPermissionStatus("unknown");
      } finally {
        if (isMounted) {
          setIsRegistering(false);
        }
      }
    };

    register();

    return () => {
      isMounted = false;
    };
  }, []);

  // Configurar listeners de notificaciones
  useEffect(() => {
    if (areListenersReady) return;
    areListenersReady = true;

    // Listener cuando llega una notificación (app en foreground)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotifications((prev) => [notification, ...prev]);

        // Mostrar toast cuando llega notificación
        const { title, body } = notification.request.content;
        if (title && body) {
          toast.success(`${title}: ${body}`);
        } else if (title) {
          toast.success(title);
        }
      });

    // Listener cuando el usuario interactúa con la notificación
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        // Navegar según el tipo de notificación
        if (data?.eventoId) {
          // Si viene un eventoId, navegar a la tab de eventos
          router.push("/event" as any);
        } else if (data?.avalId) {
          // Si viene un avalId, navegar a la tab de avales
          router.push("/" as any);
        } else if (data?.screen) {
          // Si viene una ruta específica
          router.push(data.screen as any);
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return {
    // Properties
    expoPushToken,
    notifications,
    isRegistering,
    permissionStatus,

    // Methods (para uso futuro si necesitas enviar notificaciones manualmente)
    clearNotifications: () => setNotifications([]),
  };
};
