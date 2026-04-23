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
import { useResponsive } from "@/hooks/useResponsive";
import { MainTabParamList } from "@/navigation/types";
import { arenaTheme } from "@/theme";

type Props = BottomTabScreenProps<MainTabParamList, "Social">;

export function SocialScreen(_: Props) {
  const [friendUsername, setFriendUsername] = useState("rookie");
  const [teamName, setTeamName] = useState("Nightfall");
  const [region, setRegion] = useState("NA West");
  const { isDesktop } = useResponsive();
  const friendsQuery = useFriendsQuery();
  const sendFriendRequest = useSendFriendRequestMutation();
  const createTeam = useCreateTeamMutation();

  return (
    <Screen>
      <SectionHeader
        title="Squad & Social"
        subtitle="Friend invites, lightweight team creation, and the core social hooks employers like to see."
      />

      <View style={[styles.formsGrid, isDesktop ? styles.formsGridDesktop : null]}>
        <GlassCard style={[styles.form, isDesktop ? styles.formDesktop : null]}>
          <Text style={styles.cardTitle}>Invite a friend</Text>
          <TextInput
            value={friendUsername}
            onChangeText={setFriendUsername}
            placeholder="Username"
            placeholderTextColor={arenaTheme.colors.textSecondary}
            style={styles.input}
          />
          {sendFriendRequest.error ? (
            <Text style={styles.error}>{sendFriendRequest.error.message}</Text>
          ) : null}
          <Pressable
            style={styles.primaryButton}
            onPress={() => sendFriendRequest.mutate({ username: friendUsername })}
          >
            <Text style={styles.primaryButtonText}>
              {sendFriendRequest.isPending ? "Sending..." : "Send invite"}
            </Text>
          </Pressable>
        </GlassCard>

        <GlassCard style={[styles.form, isDesktop ? styles.formDesktop : null]}>
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
          {createTeam.error ? (
            <Text style={styles.error}>{createTeam.error.message}</Text>
          ) : null}
          <Pressable
            style={styles.secondaryButton}
            onPress={() => createTeam.mutate({ name: teamName, region })}
          >
            <Text style={styles.secondaryButtonText}>
              {createTeam.isPending ? "Creating..." : "Create team"}
            </Text>
          </Pressable>
        </GlassCard>
      </View>

      <SectionHeader title="Friends list" subtitle="Accepted and pending relationships from the backend social graph." />
      <View style={[styles.friendsGrid, isDesktop ? styles.friendsGridDesktop : null]}>
        {friendsQuery.data?.map((friend) => (
          <GlassCard
            key={friend.id}
            style={[styles.friendCard, isDesktop ? styles.friendCardDesktop : null]}
          >
            <View>
              <Text style={styles.friendName}>{friend.displayName}</Text>
              <Text style={styles.friendMeta}>
                @{friend.username} - rank #{friend.rank}
              </Text>
            </View>
            <Text style={styles.friendStatus}>{friend.status}</Text>
          </GlassCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formsGrid: {
    gap: 16
  },
  formsGridDesktop: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  form: {
    gap: 12
  },
  formDesktop: {
    flex: 1
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
  error: {
    color: arenaTheme.colors.danger
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
  friendsGrid: {
    gap: 12
  },
  friendsGridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  friendCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  friendCardDesktop: {
    width: "48.8%"
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
