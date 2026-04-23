import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useProfileQuery, useTournamentsQuery } from "@/api/hooks";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { TournamentCard } from "@/components/TournamentCard";
import { MainTabParamList, RootStackParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = BottomTabScreenProps<MainTabParamList, "Home">;

export function HomeScreen(_: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tournamentsQuery = useTournamentsQuery();
  const profileQuery = useProfileQuery();

  if (tournamentsQuery.isLoading || profileQuery.isLoading) {
    return (
      <Screen contentStyle={styles.loader}>
        <ActivityIndicator size="large" color={arenaTheme.colors.accent} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>LIVE OPS</Text>
        <Text style={styles.title}>
          {profileQuery.data?.displayName}, your squad is one bracket away from a finals run.
        </Text>
        <Text style={styles.subtitle}>
          Jump into active tournaments, track live matches, and manage your team from a single mobile cockpit.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="Rank"
          value={`#${profileQuery.data?.rank ?? "--"}`}
        />
        <StatCard
          label="Friends"
          value={`${profileQuery.data?.friendsCount ?? 0}`}
        />
      </View>

      <SectionHeader
        title="Featured Tournaments"
        subtitle="High-visibility events with live brackets and leaderboard sync."
      />

      {tournamentsQuery.data?.map((tournament) => (
        <TournamentCard
          key={tournament.id}
          tournament={tournament}
          onPress={() =>
            navigation.navigate("TournamentDetail", {
              tournamentId: tournament.id
            })
          }
        />
      ))}

      <Pressable style={styles.ctaCard}>
        <Text style={styles.ctaLabel}>Creator tools</Text>
        <Text style={styles.ctaTitle}>Admin tournament workflows are scaffolded in the backend.</Text>
        <Text style={styles.ctaCopy}>
          Extend this into a full admin panel for seeding, moderation, and analytics.
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center"
  },
  hero: {
    gap: 10
  },
  kicker: {
    color: arenaTheme.colors.accentWarm,
    fontWeight: "800",
    letterSpacing: 2
  },
  title: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36
  },
  subtitle: {
    color: arenaTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  statsRow: {
    flexDirection: "row",
    gap: 12
  },
  ctaCard: {
    backgroundColor: "rgba(76, 245, 186, 0.12)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(76, 245, 186, 0.2)"
  },
  ctaLabel: {
    color: arenaTheme.colors.accent,
    fontWeight: "800",
    marginBottom: 8
  },
  ctaTitle: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8
  },
  ctaCopy: {
    color: arenaTheme.colors.textSecondary,
    lineHeight: 21
  }
});

