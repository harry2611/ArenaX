import Constants from "expo-constants";

type ArenaExtraConfig = {
  apiBaseUrl?: string;
  wsBaseUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ArenaExtraConfig;

export const appConfig = {
  apiBaseUrl: extra.apiBaseUrl ?? "http://localhost:8080/api/v1",
  wsBaseUrl: extra.wsBaseUrl ?? "ws://localhost:8080/ws"
};

