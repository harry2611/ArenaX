export type UserRole = "PLAYER" | "ADMIN";
export type TournamentStatus = "UPCOMING" | "LIVE" | "COMPLETED";
export type MatchStatus = "SCHEDULED" | "LIVE" | "COMPLETED";
export type FriendshipStatus = "PENDING" | "ACCEPTED";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  rank: number;
  preferredRole: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface TournamentSummary {
  id: number;
  name: string;
  gameTitle: string;
  format: string;
  status: TournamentStatus;
  startAt: string;
  registrationClosesAt: string;
  registeredTeams: number;
  maxTeams: number;
  prizePool: string;
  region: string;
  heroTag: string;
}

export interface TeamSummary {
  id: number;
  name: string;
  region: string;
  captainName: string;
  memberCount: number;
  inviteCode: string;
}

export interface LeaderboardEntry {
  id: number;
  teamId: number;
  teamName: string;
  points: number;
  wins: number;
  losses: number;
  streak: string;
}

export interface MatchSummary {
  id: number;
  roundLabel: string;
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  scheduledAt: string;
  status: MatchStatus;
  winnerTeamName?: string;
}

export interface TournamentDetail extends TournamentSummary {
  description: string;
  rules: string[];
  teams: TeamSummary[];
  matches: MatchSummary[];
  leaderboard: LeaderboardEntry[];
}

export interface FriendSummary {
  id: number;
  displayName: string;
  username: string;
  rank: number;
  status: FriendshipStatus;
}

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  displayName: string;
  rank: number;
  preferredRole: string;
  favoriteGame: string;
  wins: number;
  losses: number;
  friendsCount: number;
  activeTeam?: TeamSummary;
}

export interface ChatMessage {
  id: number;
  matchId: number;
  senderId: number;
  senderDisplayName: string;
  content: string;
  sentAt: string;
}

export interface DeviceRegistrationPayload {
  token: string;
  platform: string;
}

export interface NotificationPreview {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

