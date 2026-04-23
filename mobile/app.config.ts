import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "ArenaX",
  slug: "arenax",
  scheme: "arenax",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "dark",
  splash: {
    backgroundColor: "#08101d"
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "gg.arenax.mobile"
  },
  android: {
    package: "gg.arenax.mobile"
  },
  plugins: ["expo-notifications", "expo-asset"],
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1",
    wsBaseUrl: process.env.EXPO_PUBLIC_WS_BASE_URL ?? "ws://localhost:8080/ws"
  }
});
