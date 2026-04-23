import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { AuthStackParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>ARENAX</Text>
        <Text style={styles.title}>Enter the mobile arena for tournaments, squads, and live hype.</Text>
        <Text style={styles.subtitle}>
          Join brackets, track leaderboards in real time, and keep your team in sync from one gaming-first app.
        </Text>
      </View>

      <GlassCard>
        <Text style={styles.cardTitle}>What this demo includes</Text>
        <Text style={styles.cardCopy}>Live leaderboard sync, tournament browsing, social graph basics, match chat, and push notification onboarding.</Text>
      </GlassCard>

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.primaryButtonText}>Create account</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.secondaryButtonText}>I already have access</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 18
  },
  hero: {
    gap: 10
  },
  kicker: {
    color: arenaTheme.colors.accentBlue,
    letterSpacing: 2,
    fontWeight: "800"
  },
  title: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40
  },
  subtitle: {
    color: arenaTheme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24
  },
  cardTitle: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8
  },
  cardCopy: {
    color: arenaTheme.colors.textSecondary,
    lineHeight: 22
  },
  primaryButton: {
    backgroundColor: arenaTheme.colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#03110d",
    fontWeight: "800",
    fontSize: 16
  },
  secondaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: arenaTheme.colors.border
  },
  secondaryButtonText: {
    color: arenaTheme.colors.textPrimary,
    fontWeight: "700"
  }
});

