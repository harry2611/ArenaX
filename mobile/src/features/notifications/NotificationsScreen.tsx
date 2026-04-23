import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import { useNotificationsQuery } from "@/api/hooks";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useResponsive } from "@/hooks/useResponsive";
import { MainTabParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = BottomTabScreenProps<MainTabParamList, "Notifications">;

export function NotificationsScreen(_: Props) {
  const { isDesktop } = useResponsive();
  const notificationStatus = usePushNotifications();
  const notificationsQuery = useNotificationsQuery();
  const statusCopy = {
    idle: "Sign in to register this device for live event notifications.",
    enabled: "Push notifications are enabled on this mobile device.",
    blocked: "Notification permissions are blocked for ArenaX on this device.",
    unsupported: "Desktop and web use the in-app feed in this demo instead of native push tokens.",
    error: "Notification setup hit an error. Re-open the app and try again."
  }[notificationStatus];

  return (
    <Screen>
      <View style={[styles.layout, isDesktop ? styles.layoutDesktop : null]}>
        <View style={styles.sidebar}>
          <SectionHeader
            title="Alerts"
            subtitle="Push registration, invite activity, and system-generated tournament notifications."
          />

          <GlassCard>
            <Text style={styles.statusLabel}>Push setup</Text>
            <Text style={styles.statusValue}>{notificationStatus}</Text>
            <Text style={styles.statusBody}>{statusCopy}</Text>
          </GlassCard>
        </View>

        <View style={styles.feed}>
          {notificationsQuery.data?.map((notification) => (
            <GlassCard key={notification.id}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationBody}>{notification.body}</Text>
              <Text style={styles.notificationTime}>
                {new Date(notification.createdAt).toLocaleString()}
              </Text>
            </GlassCard>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  layout: {
    gap: 16
  },
  layoutDesktop: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  sidebar: {
    flex: 1,
    gap: 16
  },
  feed: {
    flex: 2,
    gap: 16
  },
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
  statusBody: {
    color: arenaTheme.colors.textSecondary,
    marginTop: 10,
    lineHeight: 21
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
