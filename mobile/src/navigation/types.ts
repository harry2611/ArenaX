export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Social: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  TournamentDetail: { tournamentId: number };
  MatchChat: { matchId: number; matchLabel: string };
};

