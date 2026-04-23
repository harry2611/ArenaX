import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { arenaTheme } from "@/theme";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function GlassCard({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: arenaTheme.colors.card,
    borderRadius: arenaTheme.radius.lg,
    borderWidth: 1,
    borderColor: arenaTheme.colors.border,
    padding: 18
  }
});

