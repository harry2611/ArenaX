import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { arenaTheme } from "@/theme";
import { useAuthStore } from "@/store/useAuthStore";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { LoginScreen } from "@/features/auth/screens/LoginScreen";
import { MatchChatScreen } from "@/features/chat/screens/MatchChatScreen";
import { NotificationsScreen } from "@/features/notifications/NotificationsScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
import { RegisterScreen } from "@/features/auth/screens/RegisterScreen";
import { SocialScreen } from "@/features/social/screens/SocialScreen";
import { TournamentDetailScreen } from "@/features/tournaments/screens/TournamentDetailScreen";
import { WelcomeScreen } from "@/features/auth/screens/WelcomeScreen";
import { AuthStackParamList, MainTabParamList, RootStackParamList } from "@/navigation/types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#09111e",
          borderTopColor: "rgba(255,255,255,0.08)"
        },
        tabBarActiveTintColor: arenaTheme.colors.accent,
        tabBarInactiveTintColor: arenaTheme.colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: "flash",
            Social: "people",
            Notifications: "notifications",
            Profile: "person-circle"
          };

          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
      </AuthStack.Navigator>
    );
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerTintColor: arenaTheme.colors.textPrimary,
        headerStyle: {
          backgroundColor: "#0b1320"
        },
        contentStyle: {
          backgroundColor: arenaTheme.colors.background
        }
      }}
    >
      <RootStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="TournamentDetail"
        component={TournamentDetailScreen}
        options={{ title: "Tournament" }}
      />
      <RootStack.Screen
        name="MatchChat"
        component={MatchChatScreen}
        options={({ route }) => ({ title: route.params.matchLabel })}
      />
    </RootStack.Navigator>
  );
}

