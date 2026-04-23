import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text } from "react-native";
import { useMatchChatQuery, useSendMatchMessageMutation } from "@/api/hooks";
import { ChatComposer } from "@/components/ChatComposer";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { RootStackParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";
import { ChatMessage } from "@/types/api";

type Props = NativeStackScreenProps<RootStackParamList, "MatchChat">;

export function MatchChatScreen({ route }: Props) {
  const { matchId } = route.params;
  const chatQuery = useMatchChatQuery(matchId);
  const sendMessage = useSendMatchMessageMutation(matchId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (chatQuery.data) {
      setMessages(chatQuery.data);
    }
  }, [chatQuery.data]);

  useRealtimeSubscription(`/topic/matches/${matchId}/chat`, (body) => {
    const nextMessage = JSON.parse(body) as ChatMessage;
    setMessages((current) =>
      current.some((message) => message.id === nextMessage.id)
        ? current
        : [...current, nextMessage]
    );
  });

  return (
    <Screen>
      {messages.map((message) => (
        <GlassCard key={message.id}>
          <Text style={styles.sender}>{message.senderDisplayName}</Text>
          <Text style={styles.content}>{message.content}</Text>
          <Text style={styles.time}>
            {new Date(message.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Text>
        </GlassCard>
      ))}

      <ChatComposer
        loading={sendMessage.isPending}
        onSend={(content) => {
          sendMessage.mutate(
            { content },
            {
              onSuccess: (message) => {
                setMessages((current) =>
                  current.some((item) => item.id === message.id)
                    ? current
                    : [...current, message]
                );
              }
            }
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sender: {
    color: arenaTheme.colors.accentBlue,
    fontWeight: "700",
    marginBottom: 8
  },
  content: {
    color: arenaTheme.colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8
  },
  time: {
    color: arenaTheme.colors.textSecondary,
    fontSize: 12
  }
});

