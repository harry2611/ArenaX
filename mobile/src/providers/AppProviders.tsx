import { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  PersistQueryClientProvider,
  persistQueryClientRestore
} from "@tanstack/react-query-persist-client";
import { QueryClient } from "@tanstack/react-query";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { arenaTheme } from "@/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1
    },
    mutations: {
      retry: 0
    }
  }
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage
});

void persistQueryClientRestore({
  queryClient,
  persister: asyncStoragePersister
});

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: arenaTheme.colors.background,
    card: arenaTheme.colors.cardStrong,
    border: arenaTheme.colors.border,
    primary: arenaTheme.colors.accent,
    text: arenaTheme.colors.textPrimary
  }
};

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <NavigationContainer theme={navigationTheme}>
            {children}
          </NavigationContainer>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

