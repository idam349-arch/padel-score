// ──────────────────────────────────────────────
// PROFESSIONAL MODE TYPES
// ──────────────────────────────────────────────

export type PointValue = 0 | 15 | 30 | 40 | "AD";
export type TeamId = "A" | "B";

export interface Team {
  id: TeamId;
  name: string;
  players: string[];
}

export interface SetScore {
  A: number;
  B: number;
  tiebreakA?: number;
  tiebreakB?: number;
}

export interface MatchScore {
  sets: SetScore[];
  currentSet: number;
  gamesA: number;
  gamesB: number;
  pointsA: PointValue;
  pointsB: PointValue;
  isDeuce: boolean;
  isAdvantage: TeamId | null;
  isTiebreak: boolean;
  tiebreakPointA: number;
  tiebreakPointB: number;
  server: TeamId;
  winner: TeamId | null;
  matchPhase: "playing" | "tiebreak" | "superTiebreak" | "finished";
}

export interface ProfessionalState {
  teamA: Team;
  teamB: Team;
  match: MatchScore;
  history: MatchScore[];
  gameStarted: boolean;
}

// ──────────────────────────────────────────────
// AMERICANO MODE TYPES
// ──────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  totalPoints: number;
  gamesPlayed: number;
  wins: number;
}

export interface AmericanoRound {
  id: number;
  teamA: [string, string];
  teamB: [string, string];
  scoreA: number;
  scoreB: number;
  completed: boolean;
  maxPoints: number;
  server: "A" | "B"; // which team serves this round
}

export interface AmericanoState {
  players: Player[];
  rounds: AmericanoRound[];
  currentRound: number;
  gameStarted: boolean;
  gameFinished: boolean;
  maxPointsPerRound: number;
}
