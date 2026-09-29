"use client";
import { useState } from "react";
import { useAmericanoScore } from "@/hooks/useAmericanoScore";
import styles from "./americano.module.css";
import {
  ArrowLeft, ChevronRight,
  Plus, Minus, CheckCircle, Circle
} from "lucide-react";

// ─── SETUP ───────────────────────────────────────────────────────────────────
function SetupScreen({ onStart }: { onStart: (names: string[], max: number) => void }) {
  const [names, setNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [maxPoints, setMaxPoints] = useState(21);

  const setName = (i: number, val: string) => {
    const n = [...names];
    n[i] = val;
    setNames(n);
  };

  const colors = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e"];

  return (
    <div className={styles.setupWrap}>
      <div className={styles.setupCard}>
        <div className={styles.setupIcon}>🌀</div>
        <h1 className={styles.setupTitle}>Americano</h1>
        <p className={styles.setupSub}>4 players • Rotating pairs • Play to {maxPoints} points</p>

        <div className={styles.playerList}>
          {names.map((name, i) => (
            <div key={i} className={styles.playerRow}>
              <div className={styles.playerNum} style={{ background: colors[i] }}>
                P{i + 1}
              </div>
              <input
                id={`input-player-${i + 1}`}
                className={styles.input}
                value={name}
                onChange={e => setName(i, e.target.value)}
                placeholder={`Player ${i + 1} name`}
              />
            </div>
          ))}
        </div>

        <div className={styles.maxPtsSection}>
          <label className={styles.label}>Points per Round</label>
          <div className={styles.maxPtsRow}>
            {[16, 21, 24, 32].map(p => (
              <button
                key={p}
                id={`btn-points-${p}`}
                className={`${styles.ptsBtn} ${maxPoints === p ? styles.ptsBtnActive : ""}`}
                onClick={() => setMaxPoints(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          id="btn-start-americano"
          className={styles.startBtn}
          onClick={() => onStart(names, maxPoints)}
        >
          Start Game <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── ROUND SCORER ─────────────────────────────────────────────────────────────
function RoundScorer({
  round,
  getPlayerName,
  onScore,
  onComplete,
}: {
  round: ReturnType<typeof useAmericanoScore>["state"]["rounds"][0];
  getPlayerName: (id: string) => string;
  onScore: (team: "A" | "B", delta: number) => void;
  onComplete: () => void;
}) {
  const maxScore = round.maxPoints;
  const pctA = (round.scoreA / maxScore) * 100;
  const pctB = (round.scoreB / maxScore) * 100;
  const canComplete = round.scoreA + round.scoreB > 0;
  const isLeadingA = round.scoreA > round.scoreB;
  const isLeadingB = round.scoreB > round.scoreA;

  return (
    <div className={styles.roundCard}>
      {/* Progress bar */}
      <div className={styles.progressBarWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFillA} style={{ width: `${pctA}%` }} />
          <div className={styles.progressFillB} style={{ width: `${pctB}%` }} />
        </div>
        <div className={styles.progressLabels}>
          <span style={{ color: "#818cf8" }}>{round.scoreA}</span>
          <span className={styles.progressTarget}>/{maxScore}</span>
          <span style={{ color: "#34d399" }}>{round.scoreB}</span>
        </div>
      </div>

      {/* Teams */}
      <div className={styles.roundTeams}>
        {/* Team A */}
        <div className={`${styles.roundTeam} ${round.server === "A" ? styles.teamServing : ""}`}>
          <div className={styles.teamPairNames}>
            <span className={styles.teamPairBadge} style={{ background: "rgba(99,102,241,0.15)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>Team A</span>
            <div className={styles.pairPlayers}>
              <span>{getPlayerName(round.teamA[0])}</span>
              <span className={styles.andLabel}>&</span>
              <span>{getPlayerName(round.teamA[1])}</span>
            </div>
          </div>
          {round.server === "A" && (
            <div className={styles.serveBadge}>🎾 Serving</div>
          )}
          <div className={`${styles.scoreDisplay} ${isLeadingA ? styles.scoreLeading : ""}`} style={{ color: "#818cf8" }}>
            {round.scoreA}
          </div>
          <div className={styles.scoreBtns}>
            <button id={`btn-minus-a-r${round.id}`} className={`${styles.scoreBtn} ${styles.scoreBtnMinus}`} onClick={() => onScore("A", -1)}>
              <Minus size={16} />
            </button>
            <button id={`btn-plus-a-r${round.id}`} className={`${styles.scoreBtn} ${styles.scoreBtnPlus}`} onClick={() => onScore("A", 1)}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* VS */}
        <div className={styles.vsChip}>VS</div>

        {/* Team B */}
        <div className={`${styles.roundTeam} ${round.server === "B" ? styles.teamServing : ""}`}>
          <div className={styles.teamPairNames}>
            <span className={styles.teamPairBadge} style={{ background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.3)", color: "#34d399" }}>Team B</span>
            <div className={styles.pairPlayers}>
              <span>{getPlayerName(round.teamB[0])}</span>
              <span className={styles.andLabel}>&</span>
              <span>{getPlayerName(round.teamB[1])}</span>
            </div>
          </div>
          {round.server === "B" && (
            <div className={styles.serveBadge}>🎾 Serving</div>
          )}
          <div className={`${styles.scoreDisplay} ${isLeadingB ? styles.scoreLeading : ""}`} style={{ color: "#34d399" }}>
            {round.scoreB}
          </div>
          <div className={styles.scoreBtns}>
            <button id={`btn-minus-b-r${round.id}`} className={`${styles.scoreBtn} ${styles.scoreBtnMinus}`} onClick={() => onScore("B", -1)}>
              <Minus size={16} />
            </button>
            <button id={`btn-plus-b-r${round.id}`} className={`${styles.scoreBtn} ${styles.scoreBtnPlus}`} onClick={() => onScore("B", 1)}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusItem}>
          <Circle size={7} className={styles.liveDot} />
          <span>Live</span>
        </div>
        <div className={styles.statusItem}>
          Round {round.id + 1}
        </div>
        <div className={styles.statusItem}>
          {round.scoreA === round.scoreB && round.scoreA === 0
            ? "In Play"
            : round.scoreA === round.scoreB
            ? "Tied"
            : isLeadingA
            ? "Team A leads"
            : "Team B leads"}
        </div>
      </div>

      <button
        id={`btn-complete-round-${round.id}`}
        className={`${styles.completeBtn} ${canComplete ? styles.completeBtnActive : ""}`}
        onClick={onComplete}
        disabled={!canComplete}
      >
        <CheckCircle size={18} />
        Complete Round {round.id + 1}
      </button>
    </div>
  );
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
function Leaderboard({
  players,
  title = "Leaderboard",
}: {
  players: ReturnType<typeof useAmericanoScore>["state"]["players"];
  title?: string;
}) {
  const sorted = [...players].sort((a, b) => b.totalPoints - a.totalPoints || b.wins - a.wins);
  const medals = ["🥇", "🥈", "🥉", ""];

  return (
    <div className={styles.leaderboard}>
      <h3 className={styles.leaderboardTitle}>{title}</h3>
      {sorted.map((p, i) => (
        <div key={p.id} className={`${styles.leaderRow} ${i === 0 ? styles.leaderFirst : ""}`}>
          <span className={styles.leaderRank}>{medals[i] || i + 1}</span>
          <span className={styles.leaderName}>{p.name}</span>
          <div className={styles.leaderStats}>
            <span className={styles.leaderPts}>{p.totalPoints} pts</span>
            <span className={styles.leaderWins}>{p.wins}W</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FINISHED SCREEN ─────────────────────────────────────────────────────────
function FinishedScreen({
  players,
  onHome,
}: {
  players: ReturnType<typeof useAmericanoScore>["state"]["players"];
  onHome: () => void;
}) {
  const sorted = [...players].sort((a, b) => b.totalPoints - a.totalPoints);
  const winner = sorted[0];
  const medals = ["🥇", "🥈", "🥉", "4️⃣"];

  return (
    <div className={styles.finishedWrap}>
      <div className={styles.finishedCard}>
        <div className={styles.finishedEmoji}>🏆</div>
        <div className={styles.finishedLabel}>Game Over!</div>
        <div className={styles.finishedWinner}>{winner.name} Wins!</div>

        <div className={styles.finalLeaderboard}>
          {sorted.map((p, i) => (
            <div key={p.id} className={`${styles.finalRow} ${i === 0 ? styles.finalRowFirst : ""}`}>
              <span className={styles.finalMedal}>{medals[i]}</span>
              <span className={styles.finalName}>{p.name}</span>
              <span className={styles.finalPts}>{p.totalPoints} pts</span>
            </div>
          ))}
        </div>

        <div className={styles.finishedActions}>
          <button id="btn-americano-home" className={styles.homeBtn} onClick={onHome}>
            <ArrowLeft size={16} /> Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function AmericanoPage() {
  const { state, startGame, updateRoundScore, completeRound, goHome, getPlayerName } = useAmericanoScore();

  if (!state.gameStarted) return <SetupScreen onStart={startGame} />;
  if (state.gameFinished) return <FinishedScreen players={state.players} onHome={goHome} />;

  const currentRound = state.rounds[state.currentRound];

  return (
    <div className={styles.pageWrap}>
      {/* Header */}
      <div className={styles.header}>
        <button id="btn-americano-back" className={styles.backBtn} onClick={goHome}>
          <ArrowLeft size={16} /> Home
        </button>
        <div className={styles.headerCenter}>
          <span className={styles.headerIcon}>🌀</span>
          <span className={styles.headerTitle}>Americano</span>
        </div>
        <div className={styles.roundBadge}>
          Round {state.currentRound + 1}/{state.rounds.length}
        </div>
      </div>

      {/* Round dots */}
      <div className={styles.roundDots}>
        {state.rounds.map((r, i) => (
          <div
            key={i}
            className={`${styles.roundDot} ${r.completed ? styles.roundDotDone : i === state.currentRound ? styles.roundDotActive : ""}`}
          />
        ))}
      </div>

      <div className={styles.mainContent}>
        {/* Active round */}
        <div className={styles.leftCol}>
          <h2 className={styles.sectionTitle}>
            Round {state.currentRound + 1}
          </h2>
          <RoundScorer
            round={currentRound}
            getPlayerName={getPlayerName}
            onScore={(t, d) => updateRoundScore(currentRound.id, t, d)}
            onComplete={() => completeRound(currentRound.id)}
          />
        </div>

        {/* Leaderboard */}
        <div className={styles.rightCol}>
          <Leaderboard players={state.players} title="Live Leaderboard" />
        </div>
      </div>
    </div>
  );
}
