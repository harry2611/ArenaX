import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { arenaTheme } from "@/theme";

type Props = {
  loading?: boolean;
  onSend: (message: string) => void;
};

export function ChatComposer({ loading, onSend }: Props) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    onSend(message.trim());
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Drop a quick match update..."
        placeholderTextColor={arenaTheme.colors.textSecondary}
        style={styles.input}
      />
      <Pressable
        style={[styles.button, loading ? styles.buttonDisabled : null]}
        onPress={handleSend}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "..." : "Send"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  input: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    color: arenaTheme.colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: arenaTheme.colors.border
  },
  button: {
    backgroundColor: arenaTheme.colors.accent,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: "#03110d",
    fontWeight: "700"
  }
});

