import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  useJoinTournamentMutation,
  useProfileQuery,
  useTournamentDetailQuery
} from "@/api/hooks";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { useResponsive } from "@/hooks/useResponsive";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { LeaderboardEntry, MatchSummary } from "@/types/api";
import { RootStackParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "TournamentDetail">;

export function TournamentDetailScreen({ navigation, route }: Props) {
  const { tournamentId } = route.params;
  const tournamentQuery = useTournamentDetailQuery(tournamentId);
  const profileQuery = useProfileQuery();
  const joinMutation = useJoinTournamentMutation(tournamentId);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { isDesktop } = useResponsive();

  useEffect(() => {
    if (tournamentQuery.data?.leaderboard) {
      setLeaderboard(tournamentQuery.data.leaderboard);
    }
  }, [tournamentQuery.data]);

  useRealtimeSubscription(`/topic/tournaments/${tournamentId}/leaderboard`, (body) => {
    const payload = JSON.parse(body) as LeaderboardEntry[];
    setLeaderboard(payload);
  });

  if (!tournamentQuery.data) {
    return (
      <Screen>
        <Text style={styles.loading}>Loading tournament...</Text>
      </Screen>
    );
  }

  const registrationClosed =
    new Date(tournamentQuery.data.registrationClosesAt).getTime() < Date.now();
  const activeTeam = profileQuery.data?.activeTeam;
  const hasJoined = activeTeam
    ? tournamentQuery.data.teams.some((team) => team.id === activeTeam.id)
    : false;
  const joinButtonLabel = hasJoined
    ? "Already joined"
    : registrationClosed
      ? "Registration closed"
      : joinMutation.isPending
        ? "Joining..."
        : joinMutation.isSuccess
          ? "Joined"
          : "Join Tournament";

  return (
    <Screen>
      <View style={[styles.overviewGrid, isDesktop ? styles.overviewGridDesktop : null]}>
        <View style={styles.overviewPrimary}>
          <View style={styles.hero}>
            <Text style={styles.game}>{tournamentQuery.data.gameTitle}</Text>
            <Text style={styles.title}>{tournamentQuery.data.name}</Text>
            <Text style={styles.copy}>{tournamentQuery.data.description}</Text>
          </View>

          <Pressable
            style={[
              styles.joinButton,
              registrationClosed || hasJoined ? styles.joinButtonDisabled : null
            ]}
            onPress={() => joinMutation.mutate()}
            disabled={registrationClosed || hasJoined || joinMutation.isPending}
          >
            <Text style={styles.joinButtonText}>{joinButtonLabel}</Text>
          </Pressable>
          {hasJoined && activeTeam ? (
            <Text style={styles.success}>
              {activeTeam.name} is already registered for this tournament.
            </Text>
          ) : null}
          {joinMutation.isSuccess && !hasJoined ? (
            <Text style={styles.success}>
              Your team was added to the bracket. The leaderboard will refresh automatically.
            </Text>
          ) : null}
          {joinMutation.error ? (
            <Text style={styles.error}>{joinMutation.error.message}</Text>
          ) : null}

          <SectionHeader title="Rules" subtitle="Tournament-ready policies and reporting flow." />
          <GlassCard>
            {tournamentQuery.data.rules.map((rule) => (
              <Text key={rule} style={styles.rule}>
                - {rule}
              </Text>
            ))}
          </GlassCard>
        </View>

        <View style={styles.overviewSecondary}>
          <SectionHeader
            title="Live Leaderboard"
            subtitle="Updated through WebSocket broadcasts from the Spring Boot backend."
          />
          {leaderboard.map((entry) => (
            <GlassCard key={entry.id} style={styles.rowCard}>
              <View>
                <Text style={styles.rowTitle}>{entry.teamName}</Text>
                <Text style={styles.rowSubtitle}>
                  {entry.wins}W / {entry.losses}L - streak {entry.streak}
                </Text>
              </View>
              <Text style={styles.points}>{entry.points} pts</Text>
            </GlassCard>
          ))}
        </View>
      </View>

      <SectionHeader title="Bracket View" subtitle="Matchups ready for team chat and result reporting." />
      <View style={[styles.matchesList, isDesktop ? styles.matchesListDesktop : null]}>
        {tournamentQuery.data.matches.map((match) => (
          <View
            key={match.id}
            style={[styles.matchCell, isDesktop ? styles.matchCellDesktop : null]}
          >
            <MatchCard
              match={match}
              onPress={() =>
                navigation.navigate("MatchChat", {
                  matchId: match.id,
                  matchLabel: match.roundLabel
                })
              }
            />
          </View>
        ))}
      </View>
    </Screen>
  );
}

type MatchCardProps = {
  match: MatchSummary;
  onPress: () => void;
};

function MatchCard({ match, onPress }: MatchCardProps) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard style={styles.rowCard}>
        <View style={styles.matchMeta}>
          <Text style={styles.rowTitle}>{match.roundLabel}</Text>
          <Text style={styles.rowSubtitle}>{match.status}</Text>
        </View>
        <Text style={styles.matchScore}>
          {match.teamAName} {match.teamAScore} - {match.teamBScore} {match.teamBName}
        </Text>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overviewGrid: {
    gap: 16
  },
  overviewGridDesktop: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  overviewPrimary: {
    flex: 1.4,
    gap: 16
  },
  overviewSecondary: {
    flex: 1,
    gap: 12
  },
  hero: {
    gap: 8
  },
  game: {
    color: arenaTheme.colors.accentBlue,
    fontWeight: "700",
    letterSpacing: 1.5
  },
  title: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 30,
    fontWeight: "800"
  },
  copy: {
    color: arenaTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  joinButton: {
    backgroundColor: arenaTheme.colors.accent,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center"
  },
  joinButtonDisabled: {
    opacity: 0.5
  },
  joinButtonText: {
    color: "#03110d",
    fontWeight: "800"
  },
  error: {
    color: arenaTheme.colors.danger
  },
  success: {
    color: arenaTheme.colors.accentBlue,
    lineHeight: 21
  },
  rule: {
    color: arenaTheme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8
  },
  matchesList: {
    gap: 12
  },
  matchesListDesktop: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  matchCell: {
    width: "100%"
  },
  matchCellDesktop: {
    width: "48.8%"
  },
  rowCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16
  },
  rowTitle: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "700"
  },
  rowSubtitle: {
    color: arenaTheme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4
  },
  points: {
    color: arenaTheme.colors.accentWarm,
    fontWeight: "800"
  },
  matchMeta: {
    gap: 2
  },
  matchScore: {
    flex: 1,
    color: arenaTheme.colors.textPrimary,
    textAlign: "right",
    fontWeight: "600"
  },
  loading: {
    color: arenaTheme.colors.textPrimary
  }
});
