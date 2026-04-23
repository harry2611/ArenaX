import { StyleSheet, Text, View } from "react-native";
import { arenaTheme } from "@/theme";

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4
  },
  title: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "700"
  },
  subtitle: {
    color: arenaTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20
  }
});

