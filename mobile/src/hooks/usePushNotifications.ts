import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useRegisterDeviceMutation } from "@/api/hooks";
import { useAuthStore } from "@/store/useAuthStore";

const supportsNativePush = Platform.OS === "ios" || Platform.OS === "android";

export function usePushNotifications() {
  const token = useAuthStore((state) => state.token);
  const registerDevice = useRegisterDeviceMutation();
  const [status, setStatus] = useState<
    "idle" | "enabled" | "blocked" | "unsupported" | "error"
  >("idle");

  useEffect(() => {
    if (!token) {
      setStatus("idle");
      return;
    }

    if (!supportsNativePush) {
      setStatus("unsupported");
      return;
    }

    let mounted = true;

    const register = async () => {
      const Notifications = await import("expo-notifications");

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true
        })
      });

      const permissionState = await Notifications.getPermissionsAsync();
      let finalStatus = permissionState.status;

      if (permissionState.status !== "granted") {
        const requested = await Notifications.requestPermissionsAsync();
        finalStatus = requested.status;
      }

      if (finalStatus !== "granted") {
        if (mounted) {
          setStatus("blocked");
        }
        return;
      }

      const expoToken = await Notifications.getExpoPushTokenAsync();
      await registerDevice.mutateAsync({
        token: expoToken.data,
        platform: Platform.OS
      });

      if (mounted) {
        setStatus("enabled");
      }
    };

    register().catch(() => {
      if (mounted) {
        setStatus("error");
      }
    });

    return () => {
      mounted = false;
    };
  }, [registerDevice, token]);

  return status;
}
