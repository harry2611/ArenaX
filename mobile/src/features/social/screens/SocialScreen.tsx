import { useState } from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  useCreateTeamMutation,
  useFriendsQuery,
  useSendFriendRequestMutation
} from "@/api/hooks";
import { GlassCard } from "@/components/GlassCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { MainTabParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = BottomTabScreenProps<MainTabParamList, "Social">;

export function SocialScreen(_: Props) {
  const [friendUsername, setFriendUsername] = useState("rookie");
  const [teamName, setTeamName] = useState("Nightfall");
  const [region, setRegion] = useState("NA West");
  const friendsQuery = useFriendsQuery();
  const sendFriendRequest = useSendFriendRequestMutation();
  const createTeam = useCreateTeamMutation();

  return (
    <Screen>
      <SectionHeader
        title="Squad & Social"
        subtitle="Friend invites, lightweight team creation, and the core social hooks employers like to see."
      />

      <GlassCard style={styles.form}>
        <Text style={styles.cardTitle}>Invite a friend</Text>
        <TextInput
          value={friendUsername}
          onChangeText={setFriendUsername}
          placeholder="Username"
          placeholderTextColor={arenaTheme.colors.textSecondary}
          style={styles.input}
        />
        <Pressable
          style={styles.primaryButton}
          onPress={() => sendFriendRequest.mutate({ username: friendUsername })}
        >
          <Text style={styles.primaryButtonText}>
            {sendFriendRequest.isPending ? "Sending..." : "Send invite"}
          </Text>
        </Pressable>
      </GlassCard>

      <GlassCard style={styles.form}>
        <Text style={styles.cardTitle}>Create a team</Text>
        <TextInput
          value={teamName}
          onChangeText={setTeamName}
          placeholder="Team name"
          placeholderTextColor={arenaTheme.colors.textSecondary}
          style={styles.input}
        />
        <TextInput
          value={region}
          onChangeText={setRegion}
          placeholder="Region"
          placeholderTextColor={arenaTheme.colors.textSecondary}
          style={styles.input}
        />
        <Pressable
          style={styles.secondaryButton}
          onPress={() => createTeam.mutate({ name: teamName, region })}
        >
          <Text style={styles.secondaryButtonText}>
            {createTeam.isPending ? "Creating..." : "Create team"}
          </Text>
        </Pressable>
      </GlassCard>

      <SectionHeader title="Friends list" subtitle="Accepted and pending relationships from the backend social graph." />
      {friendsQuery.data?.map((friend) => (
        <GlassCard key={friend.id} style={styles.friendCard}>
          <View>
            <Text style={styles.friendName}>{friend.displayName}</Text>
            <Text style={styles.friendMeta}>
              @{friend.username} - rank #{friend.rank}
            </Text>
          </View>
          <Text style={styles.friendStatus}>{friend.status}</Text>
        </GlassCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12
  },
  cardTitle: {
    color: arenaTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "700"
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
  primaryButton: {
    backgroundColor: arenaTheme.colors.accent,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 14
  },
  primaryButtonText: {
    color: "#03110d",
    fontWeight: "800"
  },
  secondaryButton: {
    backgroundColor: arenaTheme.colors.accentWarm,
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 14
  },
  secondaryButtonText: {
    color: "#1c0b02",
    fontWeight: "800"
  },
  friendCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  friendName: {
    color: arenaTheme.colors.textPrimary,
    fontWeight: "700",
    fontSize: 16
  },
  friendMeta: {
    color: arenaTheme.colors.textSecondary,
    marginTop: 4
  },
  friendStatus: {
    color: arenaTheme.colors.accentBlue,
    fontWeight: "700"
  }
});
