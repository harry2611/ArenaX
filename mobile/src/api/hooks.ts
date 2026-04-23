import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import {
  AuthResponse,
  ChatMessage,
  DeviceRegistrationPayload,
  FriendSummary,
  NotificationPreview,
  ProfileResponse,
  TournamentDetail,
  TournamentSummary
} from "@/types/api";
import { useAuthStore } from "@/store/useAuthStore";

type Credentials = {
  email: string;
  password: string;
  username?: string;
  displayName?: string;
};

type CreateTeamPayload = {
  name: string;
  region: string;
};

type FriendRequestPayload = {
  username: string;
};

type ChatPayload = {
  content: string;
};

export function useTournamentsQuery() {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: () => apiClient.get<TournamentSummary[]>("/tournaments")
  });
}

export function useTournamentDetailQuery(tournamentId?: number) {
  return useQuery({
    queryKey: ["tournament", tournamentId],
    enabled: Boolean(tournamentId),
    queryFn: () => apiClient.get<TournamentDetail>(`/tournaments/${tournamentId}`)
  });
}

export function useFriendsQuery() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: () => apiClient.get<FriendSummary[]>("/social/friends")
  });
}

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.get<ProfileResponse>("/players/me")
  });
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiClient.get<NotificationPreview[]>("/notifications"),
    staleTime: 60_000
  });
}

export function useMatchChatQuery(matchId?: number) {
  return useQuery({
    queryKey: ["match-chat", matchId],
    enabled: Boolean(matchId),
    queryFn: () => apiClient.get<ChatMessage[]>(`/matches/${matchId}/chat`)
  });
}

export function useAuthMutation(mode: "login" | "register") {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: Credentials) =>
      apiClient.post<AuthResponse>(`/auth/${mode}`, payload),
    onSuccess: (response) => {
      setSession(response.token, response.user);
    }
  });
}

export function useJoinTournamentMutation(tournamentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post(`/tournaments/${tournamentId}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["tournament", tournamentId] });
    }
  });
}

export function useCreateTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => apiClient.post("/teams", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}

export function useSendFriendRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FriendRequestPayload) =>
      apiClient.post("/social/friends/request", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
}

export function useSendMatchMessageMutation(matchId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChatPayload) =>
      apiClient.post<ChatMessage>(`/matches/${matchId}/chat`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-chat", matchId] });
    }
  });
}

export function useRegisterDeviceMutation() {
  return useMutation({
    mutationFn: (payload: DeviceRegistrationPayload) =>
      apiClient.post("/notifications/devices", payload)
  });
}

