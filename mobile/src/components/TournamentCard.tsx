import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlassCard } from "@/components/GlassCard";
import { arenaTheme } from "@/theme";
import { TournamentSummary } from "@/types/api";

type Props = {
  tournament: TournamentSummary;
  onPress: () => void;
};

export function TournamentCard({ tournament, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard>
        <View style={styles.header}>
          <Text style={styles.game}>{tournament.gameTitle}</Text>
          <Text style={styles.status}>{tournament.status}</Text>
        </View>
        <Text style={styles.name}>{tournament.name}</Text>
        <Text style={styles.meta}>
          {tournament.format} - {tournament.region} - {tournament.registeredTeams}/
          {tournament.maxTeams} teams
        </Text>
        <View style={styles.footer}>
          <Text style={styles.prize}>{tournament.prizePool}</Text>
          <Text style={styles.heroTag}>{tournament.heroTag}</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  game: {
    color: arenaTheme.colors.accentBlue,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1
  },
  status: {
    color: arenaTheme.colors.accent,
    fontWeight: "700",
    fontSize: 12
  },
  name: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8
  },
  meta: {
    color: arenaTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  prize: {
    color: arenaTheme.colors.accentWarm,
    fontWeight: "700"
  },
  heroTag: {
    color: arenaTheme.colors.textPrimary,
    fontWeight: "600"
  }
});
