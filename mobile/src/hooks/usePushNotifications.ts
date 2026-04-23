import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useRegisterDeviceMutation } from "@/api/hooks";
import { useAuthStore } from "@/store/useAuthStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export function usePushNotifications() {
  const token = useAuthStore((state) => state.token);
  const registerDevice = useRegisterDeviceMutation();
  const [status, setStatus] = useState<"idle" | "enabled" | "blocked" | "error">(
    "idle"
  );

  useEffect(() => {
    if (!token) {
      setStatus("idle");
      return;
    }

    let mounted = true;

    const register = async () => {
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

