"use client";
import { useState, useCallback } from "react";
import { AmericanoState, AmericanoRound, Player } from "@/types/padel";
import { generateAmericanoRounds } from "@/lib/scoreUtils";

function createPlayers(names: string[]): Player[] {
  return names.map((name, i) => ({
    id: `p${i + 1}`,
    name: name.trim() || `Player ${i + 1}`,
    totalPoints: 0,
    gamesPlayed: 0,
    wins: 0,
  }));
}

const DEFAULT_STATE: AmericanoState = {
  players: [],
  rounds: [],
  currentRound: 0,
  gameStarted: false,
  gameFinished: false,
  maxPointsPerRound: 21,
};

export function useAmericanoScore() {
  const [state, setState] = useState<AmericanoState>(DEFAULT_STATE);

  const startGame = useCallback((names: string[], maxPoints: number) => {
    const players = createPlayers(names);
    const roundDefs = generateAmericanoRounds(players.map(p => p.id));
    const rounds: AmericanoRound[] = roundDefs.map((r, i) => ({
      id: i,
      teamA: r.teamA,
      teamB: r.teamB,
      scoreA: 0,
      scoreB: 0,
      completed: false,
      maxPoints,
      server: (i % 2 === 0 ? "A" : "B") as "A" | "B",
    }));

    setState({
      players,
      rounds,
      currentRound: 0,
      gameStarted: true,
      gameFinished: false,
      maxPointsPerRound: maxPoints,
    });
  }, []);

  const updateRoundScore = useCallback((roundId: number, team: "A" | "B", delta: number) => {
    setState(prev => {
      const rounds = prev.rounds.map(r => {
        if (r.id !== roundId) return r;
        const newScore = team === "A"
          ? Math.max(0, Math.min(r.maxPoints, r.scoreA + delta))
          : Math.max(0, Math.min(r.maxPoints, r.scoreB + delta));
        return team === "A"
          ? { ...r, scoreA: newScore }
          : { ...r, scoreB: newScore };
      });
      return { ...prev, rounds };
    });
  }, []);

  const completeRound = useCallback((roundId: number) => {
    setState(prev => {
      const round = prev.rounds.find(r => r.id === roundId);
      if (!round || round.completed) return prev;

      const updatedPlayers = prev.players.map(p => {
        let pts = 0;
        let wins = 0;
        const isInTeamA = round.teamA.includes(p.id);
        const isInTeamB = round.teamB.includes(p.id);
        if (isInTeamA) {
          pts = round.scoreA;
          wins = round.scoreA > round.scoreB ? 1 : 0;
        }
        if (isInTeamB) {
          pts = round.scoreB;
          wins = round.scoreB > round.scoreA ? 1 : 0;
        }
        return {
          ...p,
          totalPoints: p.totalPoints + pts,
          gamesPlayed: p.gamesPlayed + (isInTeamA || isInTeamB ? 1 : 0),
          wins: p.wins + wins,
        };
      });

      const updatedRounds = prev.rounds.map(r =>
        r.id === roundId ? { ...r, completed: true } : r
      );

      const nextRound = prev.currentRound + 1;
      const gameFinished = nextRound >= prev.rounds.length;

      return {
        ...prev,
        players: updatedPlayers,
        rounds: updatedRounds,
        currentRound: gameFinished ? prev.currentRound : nextRound,
        gameFinished,
      };
    });
  }, []);

  const goHome = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const getSortedLeaderboard = useCallback(() => {
    return [...state.players].sort((a, b) =>
      b.totalPoints - a.totalPoints || b.wins - a.wins
    );
  }, [state.players]);

  const getPlayerName = useCallback((id: string) => {
    return state.players.find(p => p.id === id)?.name || id;
  }, [state.players]);

  return {
    state,
    startGame,
    updateRoundScore,
    completeRound,
    goHome,
    getSortedLeaderboard,
    getPlayerName,
  };
}
