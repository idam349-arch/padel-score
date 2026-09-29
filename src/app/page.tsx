"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { Trophy, Users, ChevronRight, Zap, RotateCcw, Star } from "lucide-react";

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Background mesh */}
      <div className={styles.mesh} aria-hidden="true">
        <div className={styles.meshOrb1} />
        <div className={styles.meshOrb2} />
        <div className={styles.meshOrb3} />
      </div>

      <div className={styles.container}>
        {/* Hero */}
        <header className={styles.hero}>
          <div className={styles.logoBadge}>
            <span className={styles.logoIcon}>🎾</span>
          </div>
          <h1 className={styles.heroTitle}>
            <span className="gradient-text">Padel</span> Score
          </h1>
          <p className={styles.heroSubtitle}>
            Professional scoreboard for every padel match.<br />
            Track sets, games & points — or go Americano style.
          </p>
        </header>

        {/* Mode Cards */}
        <section className={styles.modes} aria-label="Game modes">
          {/* Professional Mode */}
          <Link href="/professional" id="btn-professional-mode" className={styles.modeCard}>
            <div className={styles.modeCardGlow} style={{ background: "radial-gradient(circle at top right, rgba(99,102,241,0.25), transparent 70%)" }} />
            <div className={styles.modeCardInner}>
              <div className={styles.modeIconWrap} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <Trophy size={28} color="white" />
              </div>
              <div className={styles.modeInfo}>
                <span className={styles.modeBadge} style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                  Official Rules
                </span>
                <h2 className={styles.modeTitle}>Professional</h2>
                <p className={styles.modeDesc}>
                  Full padel scoring: 0/15/30/40, Deuce, Advantage, Sets & Tiebreak
                </p>
                <ul className={styles.modeFeatures}>
                  <li><Zap size={13} /> Best of 3 Sets</li>
                  <li><Zap size={13} /> Deuce & Advantage</li>
                  <li><Zap size={13} /> Tie-break & Super Tie-break</li>
                  <li><Zap size={13} /> Serve Indicator</li>
                </ul>
              </div>
              <ChevronRight size={20} className={styles.modeArrow} />
            </div>
          </Link>

          {/* Americano Mode */}
          <Link href="/americano" id="btn-americano-mode" className={styles.modeCard}>
            <div className={styles.modeCardGlow} style={{ background: "radial-gradient(circle at top right, rgba(16,185,129,0.2), transparent 70%)" }} />
            <div className={styles.modeCardInner}>
              <div className={styles.modeIconWrap} style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                <Users size={28} color="white" />
              </div>
              <div className={styles.modeInfo}>
                <span className={styles.modeBadge} style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                  Amateur Friendly
                </span>
                <h2 className={styles.modeTitle}>Americano</h2>
                <p className={styles.modeDesc}>
                  4 players, rotating partners each round. Total points leaderboard.
                </p>
                <ul className={styles.modeFeatures}>
                  <li><RotateCcw size={13} /> Rotating Pairs</li>
                  <li><RotateCcw size={13} /> Point-based Scoring</li>
                  <li><RotateCcw size={13} /> Real-time Leaderboard</li>
                  <li><RotateCcw size={13} /> 3 Rounds Format</li>
                </ul>
              </div>
              <ChevronRight size={20} className={styles.modeArrow} />
            </div>
          </Link>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <Star size={14} />
          <span>Padel Score — Built for players, by players</span>
        </footer>
      </div>
    </main>
  );
}
