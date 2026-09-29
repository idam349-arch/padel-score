import { PointValue, TeamId, MatchScore } from "@/types/padel";

const POINT_SEQUENCE: PointValue[] = [0, 15, 30, 40];

export function getNextPoint(current: PointValue): PointValue {
  const idx = POINT_SEQUENCE.indexOf(current as 0 | 15 | 30 | 40);
  if (idx === -1 || idx === POINT_SEQUENCE.length - 1) return current;
  return POINT_SEQUENCE[idx + 1];
}

export function formatPoint(point: PointValue): string {
  if (point === "AD") return "AD";
  return String(point);
}

export function createInitialMatch(server: TeamId = "A"): MatchScore {
  return {
    sets: [],
    currentSet: 0,
    gamesA: 0,
    gamesB: 0,
    pointsA: 0,
    pointsB: 0,
    isDeuce: false,
    isAdvantage: null,
    isTiebreak: false,
    tiebreakPointA: 0,
    tiebreakPointB: 0,
    server,
    winner: null,
    matchPhase: "playing",
  };
}

export function addPoint(match: MatchScore, team: TeamId): MatchScore {
  const m = JSON.parse(JSON.stringify(match)) as MatchScore;

  if (m.winner) return m;

  if (m.isTiebreak || m.matchPhase === "superTiebreak") {
    return handleTiebreakPoint(m, team);
  }

  return handleNormalPoint(m, team);
}

function handleNormalPoint(m: MatchScore, team: TeamId): MatchScore {
  const isA = team === "A";

  if (m.isDeuce) {
    if (m.isAdvantage === null) {
      m.isAdvantage = team;
    } else if (m.isAdvantage === team) {
      return winGame(m, team);
    } else {
      m.isAdvantage = null;
    }
    return m;
  }

  const currA = m.pointsA;
  const currB = m.pointsB;

  if (isA) {
    if (currA === 40 && currB === 40) {
      m.isDeuce = true;
      m.isAdvantage = team;
      return m;
    }
    if (currA === 40) {
      return winGame(m, "A");
    }
    m.pointsA = getNextPoint(currA);
  } else {
    if (currB === 40 && currA === 40) {
      m.isDeuce = true;
      m.isAdvantage = team;
      return m;
    }
    if (currB === 40) {
      return winGame(m, "B");
    }
    m.pointsB = getNextPoint(currB);
  }

  // Check if both at 40 → deuce
  if (m.pointsA === 40 && m.pointsB === 40) {
    m.isDeuce = true;
    m.isAdvantage = null;
  }

  return m;
}

function handleTiebreakPoint(m: MatchScore, team: TeamId): MatchScore {
  const isA = team === "A";
  const targetPoints = m.matchPhase === "superTiebreak" ? 10 : 7;

  if (isA) m.tiebreakPointA++;
  else m.tiebreakPointB++;

  const pA = m.tiebreakPointA;
  const pB = m.tiebreakPointB;

  const winner =
    (pA >= targetPoints && pA - pB >= 2) ? "A" :
    (pB >= targetPoints && pB - pA >= 2) ? "B" : null;

  if (winner) {
    return winGame(m, winner);
  }

  // Change serve every 2 points in tiebreak
  const totalPoints = pA + pB;
  if (totalPoints % 2 === 1) {
    m.server = m.server === "A" ? "B" : "A";
  }

  return m;
}

function winGame(m: MatchScore, team: TeamId): MatchScore {
  // Reset points
  m.pointsA = 0;
  m.pointsB = 0;
  m.isDeuce = false;
  m.isAdvantage = null;
  m.isTiebreak = false;
  m.tiebreakPointA = 0;
  m.tiebreakPointB = 0;
  m.matchPhase = "playing";

  // Add game
  if (team === "A") m.gamesA++;
  else m.gamesB++;

  // Switch serve
  m.server = m.server === "A" ? "B" : "A";

  return checkSetWin(m, team);
}

function checkSetWin(m: MatchScore, team: TeamId): MatchScore {
  const gA = m.gamesA;
  const gB = m.gamesB;

  const isSetWin =
    (gA >= 6 && gA - gB >= 2) ||
    (gB >= 6 && gB - gA >= 2);

  const isTiebreak = gA === 6 && gB === 6;
  const completedSets = m.sets.length;

  // Super tiebreak as 3rd set (at 1-1 sets)
  const isSuperTiebreak = completedSets === 2 && gA === 1 && gB === 1;

  if (isSuperTiebreak && !m.isTiebreak) {
    // Actually this logic triggers correctly below
  }

  if (isTiebreak) {
    m.isTiebreak = true;
    m.matchPhase = "tiebreak";
    return m;
  }

  if (isSetWin) {
    m.sets.push({ A: m.gamesA, B: m.gamesB });
    m.gamesA = 0;
    m.gamesB = 0;
    m.currentSet++;

    // Check match win (best of 3)
    const setsA = m.sets.filter(s => s.A > s.B).length;
    const setsB = m.sets.filter(s => s.B > s.A).length;

    if (setsA === 2 || setsB === 2) {
      m.winner = setsA === 2 ? "A" : "B";
      m.matchPhase = "finished";
    } else if (m.sets.length === 2) {
      // 3rd set: super tiebreak (first to 10)
      m.matchPhase = "superTiebreak";
      m.isTiebreak = true;
    }
  }

  return m;
}

// ──────────────────────────────────────────────
// AMERICANO UTILS
// ──────────────────────────────────────────────

export function generateAmericanoRounds(playerIds: string[]): Array<{teamA: [string,string], teamB: [string,string]}> {
  const [p1, p2, p3, p4] = playerIds;
  return [
    { teamA: [p1, p2], teamB: [p3, p4] },
    { teamA: [p1, p3], teamB: [p2, p4] },
    { teamA: [p1, p4], teamB: [p2, p3] },
  ];
}
