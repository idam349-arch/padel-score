"use client";
import { useState, useCallback } from "react";
import { ProfessionalState, TeamId, MatchScore } from "@/types/padel";
import { addPoint, createInitialMatch } from "@/lib/scoreUtils";

const DEFAULT_STATE: ProfessionalState = {
  teamA: { id: "A", name: "Team A", players: ["Player 1", "Player 2"] },
  teamB: { id: "B", name: "Team B", players: ["Player 3", "Player 4"] },
  match: createInitialMatch("A"),
  history: [],
  gameStarted: false,
};

export function useProfessionalScore() {
  const [state, setState] = useState<ProfessionalState>(DEFAULT_STATE);

  const startGame = useCallback((
    teamAName: string,
    teamBName: string,
    server: TeamId = "A"
  ) => {
    setState(prev => ({
      ...prev,
      teamA: { ...prev.teamA, name: teamAName },
      teamB: { ...prev.teamB, name: teamBName },
      match: createInitialMatch(server),
      history: [],
      gameStarted: true,
    }));
  }, []);

  const scorePoint = useCallback((team: TeamId) => {
    setState(prev => {
      if (prev.match.winner) return prev;
      const newMatch = addPoint(prev.match, team);
      return {
        ...prev,
        history: [...prev.history, prev.match],
        match: newMatch,
      };
    });
  }, []);

  const undoLastPoint = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0) return prev;
      const newHistory = [...prev.history];
      const lastMatch = newHistory.pop()!;
      return { ...prev, match: lastMatch, history: newHistory };
    });
  }, []);

  const resetMatch = useCallback(() => {
    setState(prev => ({
      ...prev,
      match: createInitialMatch(prev.match.server),
      history: [],
      gameStarted: true,
    }));
  }, []);

  const goHome = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return { state, startGame, scorePoint, undoLastPoint, resetMatch, goHome };
}
