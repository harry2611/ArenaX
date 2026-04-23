import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuthMutation } from "@/api/hooks";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { AuthStackParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState("Nova Captain");
  const [username, setUsername] = useState("nova_captain");
  const [email, setEmail] = useState("new@arenax.gg");
  const [password, setPassword] = useState("password123");
  const registerMutation = useAuthMutation("register");

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.title}>Create your ArenaX identity.</Text>
      <GlassCard style={styles.form}>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Display name"
          placeholderTextColor={arenaTheme.colors.textSecondary}
          style={styles.input}
        />
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Username"
          placeholderTextColor={arenaTheme.colors.textSecondary}
          style={styles.input}
        />
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

        {registerMutation.error ? (
          <Text style={styles.error}>{registerMutation.error.message}</Text>
        ) : null}

        <Pressable
          style={styles.button}
          onPress={() =>
            registerMutation.mutate({ displayName, username, email, password })
          }
        >
          <Text style={styles.buttonText}>
            {registerMutation.isPending ? "Creating account..." : "Enter ArenaX"}
          </Text>
        </Pressable>
      </GlassCard>

      <View style={styles.footer}>
        <Text style={styles.footerCopy}>Already drafted into a team?</Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Sign in</Text>
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
    backgroundColor: arenaTheme.colors.accentWarm,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 16
  },
  buttonText: {
    color: "#1c0b02",
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

