import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "@/components/GlassCard";
import { arenaTheme } from "@/theme";

type Props = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: Props) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140
  },
  label: {
    color: arenaTheme.colors.textSecondary,
    marginBottom: 8
  },
  value: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "700"
  }
});

