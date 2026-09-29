"use client";
import { useState } from "react";
import Link from "next/link";
import { useProfessionalScore } from "@/hooks/useProfessionalScore";
import styles from "./professional.module.css";
import {
  Trophy, ArrowLeft, RotateCcw, Undo2, ChevronRight,
  Wifi, Circle, Minus
} from "lucide-react";

// ─── SETUP SCREEN ───────────────────────────────────────────────────────────
function SetupScreen({ onStart }: { onStart: (a: string, b: string, server: "A" | "B") => void }) {
  const [nameA, setNameA] = useState("Team A");
  const [nameB, setNameB] = useState("Team B");
  const [server, setServer] = useState<"A" | "B">("A");

  return (
    <div className={styles.setupWrap}>
      <Link href="/" className={styles.setupHomeBtn}>
        <ArrowLeft size={18} /> Home
      </Link>
      
      <div className={styles.setupCard}>
        <div className={styles.setupIcon}>🏆</div>
        <h1 className={styles.setupTitle}>Professional Match</h1>
        <p className={styles.setupSub}>Enter team names and first server to begin</p>

        <div className={styles.setupFields}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Team A</label>
            <input
              id="input-team-a"
              className={`${styles.input}`}
              value={nameA}
              onChange={e => setNameA(e.target.value)}
              placeholder="Team A name"
            />
          </div>
          <div className={styles.vsLabel}>VS</div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Team B</label>
            <input
              id="input-team-b"
              className={`${styles.input}`}
              value={nameB}
              onChange={e => setNameB(e.target.value)}
              placeholder="Team B name"
            />
          </div>
        </div>

        <div className={styles.serverPicker}>
          <span className={styles.label}>First Serve</span>
          <div className={styles.serverBtns}>
            <button
              id="server-btn-a"
              className={`${styles.serverBtn} ${server === "A" ? styles.serverBtnActive : ""}`}
              onClick={() => setServer("A")}
            >
              🎾 {nameA || "Team A"}
            </button>
            <button
              id="server-btn-b"
              className={`${styles.serverBtn} ${server === "B" ? styles.serverBtnActive : ""}`}
              onClick={() => setServer("B")}
            >
              🎾 {nameB || "Team B"}
            </button>
          </div>
        </div>

        <button
          id="btn-start-match"
          className={styles.startBtn}
          onClick={() => onStart(nameA || "Team A", nameB || "Team B", server)}
        >
          Start Match <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── SCOREBOARD ─────────────────────────────────────────────────────────────
function Scoreboard({
  state,
  onScore,
  onUndo,
  onReset,
  onHome,
}: {
  state: ReturnType<typeof useProfessionalScore>["state"];
  onScore: (t: "A" | "B") => void;
  onUndo: () => void;
  onReset: () => void;
  onHome: () => void;
}) {
  const { match, teamA, teamB } = state;

  const formatPoint = (p: typeof match.pointsA, isDeuce: boolean, adv: typeof match.isAdvantage, side: "A" | "B") => {
    if (isDeuce) return adv === side ? "ADV" : adv !== null ? "40" : "DEUCE";
    return String(p);
  };

  const isTiebreak = match.isTiebreak;
  const isFinished = match.winner !== null;

  return (
    <div className={styles.boardWrap}>
      {/* Winner overlay */}
      {isFinished && (
        <div className={styles.winnerOverlay}>
          <div className={styles.winnerCard}>
            <div className={styles.winnerEmoji}>🏆</div>
            <div className={styles.winnerLabel}>Match Winner</div>
            <div className={styles.winnerName}>
              {match.winner === "A" ? teamA.name : teamB.name}
            </div>
            <div className={styles.finalScore}>
              {match.sets.map((s, i) => (
                <span key={i} className={styles.finalSet}>
                  {s.A} – {s.B}
                </span>
              ))}
            </div>
            <div className={styles.winnerActions}>
              <button id="btn-new-match" className={styles.newMatchBtn} onClick={onReset}>
                <RotateCcw size={16} /> New Match
              </button>
              <button id="btn-go-home-winner" className={styles.homeBtn} onClick={onHome}>
                <ArrowLeft size={16} /> Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.boardHeader}>
        <button id="btn-back-home" className={styles.backBtn} onClick={onHome}>
          <ArrowLeft size={16} /> Home
        </button>
        <div className={styles.headerTitle}>
          {isTiebreak && <span className={styles.tiebreakBadge}>🔥 Tie-break</span>}
          {match.matchPhase === "superTiebreak" && <span className={styles.tiebreakBadge}>⚡ Super Tie-break</span>}
          {!isTiebreak && <span className={styles.matchLabel}>Professional Match</span>}
        </div>
        <div className={styles.headerActions}>
          <button id="btn-undo" className={styles.iconBtn} onClick={onUndo} title="Undo">
            <Undo2 size={16} />
          </button>
          <button id="btn-reset" className={styles.iconBtn} onClick={onReset} title="Reset">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Sets History */}
      <div className={styles.setsRow}>
        <div className={styles.setsLabel}>Sets</div>
        <div className={styles.setsGrid}>
          {[0, 1, 2].map(setIdx => {
            const completedSet = match.sets[setIdx];
            const isCurrent = setIdx === match.sets.length;
            return (
              <div key={setIdx} className={`${styles.setCell} ${isCurrent ? styles.setCellActive : ""} ${completedSet ? styles.setCellDone : ""}`}>
                <span className={completedSet && completedSet.A > completedSet.B ? styles.setWinner : ""}>
                  {completedSet ? completedSet.A : isCurrent ? match.gamesA : "–"}
                </span>
                <Minus size={10} className={styles.setDash} />
                <span className={completedSet && completedSet.B > completedSet.A ? styles.setWinner : ""}>
                  {completedSet ? completedSet.B : isCurrent ? match.gamesB : "–"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main score display */}
      <div className={styles.mainScore}>
        {/* Team A */}
        <div className={`${styles.teamBlock} ${match.server === "A" ? styles.teamServing : ""}`}>
          <div className={styles.teamName}>{teamA.name}</div>
          {match.server === "A" && (
            <div className={styles.serveBall}>🎾</div>
          )}
          <div className={styles.pointDisplay}>
            {isTiebreak
              ? match.tiebreakPointA
              : formatPoint(match.pointsA, match.isDeuce, match.isAdvantage, "A")
            }
          </div>
          <button
            id="btn-score-a"
            className={styles.scoreBtn}
            onClick={() => onScore("A")}
            disabled={isFinished}
          >
            + Point
          </button>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>VS</span>
          <div className={styles.dividerLine} />
        </div>

        {/* Team B */}
        <div className={`${styles.teamBlock} ${match.server === "B" ? styles.teamServing : ""}`}>
          <div className={styles.teamName}>{teamB.name}</div>
          {match.server === "B" && (
            <div className={styles.serveBall}>🎾</div>
          )}
          <div className={styles.pointDisplay}>
            {isTiebreak
              ? match.tiebreakPointB
              : formatPoint(match.pointsB, match.isDeuce, match.isAdvantage, "B")
            }
          </div>
          <button
            id="btn-score-b"
            className={styles.scoreBtn}
            onClick={() => onScore("B")}
            disabled={isFinished}
          >
            + Point
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusItem}>
          <Circle size={8} className={styles.liveDot} />
          <span>Live</span>
        </div>
        <div className={styles.statusItem}>
          Set {match.sets.length + 1} of 3
        </div>
        <div className={styles.statusItem}>
          {match.isDeuce ? "Deuce" :
           match.isAdvantage ? `Advantage ${match.isAdvantage === "A" ? teamA.name : teamB.name}` :
           isTiebreak ? "Tiebreak" : "In Play"}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────
export default function ProfessionalPage() {
  const { state, startGame, scorePoint, undoLastPoint, resetMatch, goHome } = useProfessionalScore();

  if (!state.gameStarted) {
    return <SetupScreen onStart={startGame} />;
  }

  return (
    <Scoreboard
      state={state}
      onScore={scorePoint}
      onUndo={undoLastPoint}
      onReset={resetMatch}
      onHome={goHome}
    />
  );
}
