import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuthMutation } from "@/api/hooks";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { AuthStackParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("captain@arenax.gg");
  const [password, setPassword] = useState("password123");
  const loginMutation = useAuthMutation("login");

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title}>Welcome back to the bracket.</Text>
      <GlassCard style={styles.form}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor={arenaTheme.colors.textSecondary}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={arenaTheme.colors.textSecondary}
          style={styles.input}
        />

        {loginMutation.error ? (
          <Text style={styles.error}>{loginMutation.error.message}</Text>
        ) : null}

        <Pressable
          style={styles.button}
          onPress={() => loginMutation.mutate({ email, password })}
        >
          <Text style={styles.buttonText}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Text>
        </Pressable>
      </GlassCard>

      <View style={styles.footer}>
        <Text style={styles.footerCopy}>Need an account?</Text>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Register</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 18
  },
  title: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 30,
    fontWeight: "800"
  },
  form: {
    gap: 14
  },
  input: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: arenaTheme.colors.border,
    color: arenaTheme.colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  button: {
    backgroundColor: arenaTheme.colors.accent,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 16
  },
  buttonText: {
    color: "#03110d",
    fontWeight: "800"
  },
  error: {
    color: arenaTheme.colors.danger
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  footerCopy: {
    color: arenaTheme.colors.textSecondary
  },
  link: {
    color: arenaTheme.colors.accent,
    fontWeight: "700"
  }
});

