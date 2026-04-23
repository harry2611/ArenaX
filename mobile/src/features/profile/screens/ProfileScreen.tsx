import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useProfileQuery } from "@/api/hooks";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { useResponsive } from "@/hooks/useResponsive";
import { MainTabParamList } from "@/navigation/types";
import { useAuthStore } from "@/store/useAuthStore";
import { arenaTheme } from "@/theme";

type Props = BottomTabScreenProps<MainTabParamList, "Profile">;

export function ProfileScreen(_: Props) {
  const logout = useAuthStore((state) => state.logout);
  const profileQuery = useProfileQuery();
  const { isDesktop } = useResponsive();

  return (
    <Screen>
      <SectionHeader
        title="Player Profile"
        subtitle="A cross-platform summary of identity, competitive stats, and active team status."
      />
      <View style={[styles.profileGrid, isDesktop ? styles.profileGridDesktop : null]}>
        <GlassCard style={[styles.profileCard, isDesktop ? styles.profileCardDesktop : null]}>
          <Text style={styles.name}>{profileQuery.data?.displayName}</Text>
          <Text style={styles.meta}>
            @{profileQuery.data?.username} - {profileQuery.data?.favoriteGame}
          </Text>
          <Text style={styles.email}>{profileQuery.data?.email}</Text>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statValue}>#{profileQuery.data?.rank ?? "--"}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
            <View>
              <Text style={styles.statValue}>
                {profileQuery.data?.wins ?? 0}-{profileQuery.data?.losses ?? 0}
              </Text>
              <Text style={styles.statLabel}>Record</Text>
            </View>
          </View>
        </GlassCard>

        {profileQuery.data?.activeTeam ? (
          <GlassCard style={isDesktop ? styles.teamCardDesktop : null}>
            <Text style={styles.teamLabel}>Active Team</Text>
            <Text style={styles.teamName}>{profileQuery.data.activeTeam.name}</Text>
            <Text style={styles.teamMeta}>
              {profileQuery.data.activeTeam.memberCount} players - captain {profileQuery.data.activeTeam.captainName}
            </Text>
          </GlassCard>
        ) : null}
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    gap: 8
  },
  profileGrid: {
    gap: 16
  },
  profileGridDesktop: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  profileCardDesktop: {
    flex: 1.4
  },
  name: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "800"
  },
  meta: {
    color: arenaTheme.colors.textSecondary
  },
  email: {
    color: arenaTheme.colors.accentBlue
  },
  statsRow: {
    flexDirection: "row",
    gap: 30,
    marginTop: 12
  },
  statValue: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "700"
  },
  statLabel: {
    color: arenaTheme.colors.textSecondary,
    marginTop: 4
  },
  teamLabel: {
    color: arenaTheme.colors.accentBlue,
    fontWeight: "800",
    marginBottom: 6
  },
  teamName: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4
  },
  teamMeta: {
    color: arenaTheme.colors.textSecondary
  },
  teamCardDesktop: {
    flex: 1
  },
  logoutButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: arenaTheme.colors.border
  },
  logoutText: {
    color: arenaTheme.colors.textPrimary,
    fontWeight: "700"
  }
});
