import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text } from "react-native";
import { useNotificationsQuery } from "@/api/hooks";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { MainTabParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = BottomTabScreenProps<MainTabParamList, "Notifications">;

export function NotificationsScreen(_: Props) {
  const notificationStatus = usePushNotifications();
  const notificationsQuery = useNotificationsQuery();

  return (
    <Screen>
      <SectionHeader
        title="Alerts"
        subtitle="Push registration, invite activity, and system-generated tournament notifications."
      />

      <GlassCard>
        <Text style={styles.statusLabel}>Push setup</Text>
        <Text style={styles.statusValue}>{notificationStatus}</Text>
      </GlassCard>

      {notificationsQuery.data?.map((notification) => (
        <GlassCard key={notification.id}>
          <Text style={styles.notificationTitle}>{notification.title}</Text>
          <Text style={styles.notificationBody}>{notification.body}</Text>
          <Text style={styles.notificationTime}>
            {new Date(notification.createdAt).toLocaleString()}
          </Text>
        </GlassCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusLabel: {
    color: arenaTheme.colors.textSecondary,
    marginBottom: 6
  },
  statusValue: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  notificationTitle: {
    color: arenaTheme.colors.textPrimary,
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 8
  },
  notificationBody: {
    color: arenaTheme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: 8
  },
  notificationTime: {
    color: arenaTheme.colors.accentBlue,
    fontSize: 12
  }
});
