import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameFinishedView from "../components/game/GameFinishedView";
import GamePlayView from "../components/game/GamePlayView";
import { isValidGameConfig } from "../constants/gameConfig";
import { useAuth } from "../contexts/useAuth";
import { isEarlyStep } from "../game/judgement";
import { useNBackEngine } from "../hooks/useNBackEngine";
import { saveScore } from "../services/rankingApi";
import styles from "./Game.module.css";

const FALLBACK_GAME_CONFIG = {
  nBack: 2,
  totalSteps: 20,
  blockDuration: 2000,
};

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, nickname } = useAuth();
  const hasValidEntry = isValidGameConfig(location.state);
  const gameConfig = hasValidEntry ? location.state : FALLBACK_GAME_CONFIG;
  const savedScoreRef = useRef(false);

  useEffect(() => {
    if (!hasValidEntry) {
      navigate("/", { replace: true });
    }
  }, [hasValidEntry, navigate]);

  const { nBack, totalSteps, blockDuration } = gameConfig;
  const { gameState, currentStep, score, combo, currentBlock, stats, startGame, handleInput } = useNBackEngine({
    nBack,
    totalSteps,
    blockDuration,
  });

  useEffect(() => {
    if (gameState === "PLAYING") {
      savedScoreRef.current = false;
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "FINISHED" || !currentUser || savedScoreRef.current) {
      return;
    }

    savedScoreRef.current = true;

    void saveScore(
      {
        uid: currentUser.uid,
        nickname: nickname || "Anonymous",
        photoURL: currentUser.photoURL || null,
      },
      {
        score,
        nBack,
        totalSteps,
        blockDuration,
      },
    );
  }, [blockDuration, currentUser, gameState, nBack, nickname, score, totalSteps]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== "Space") {
        return;
      }

      event.preventDefault();
      if (!event.repeat) {
        handleInput();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput]);

  useEffect(() => {
    if (gameState !== "PLAYING") {
      return undefined;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [gameState]);

  const earlyStep = isEarlyStep({ currentStep, nBack });

  const handleLeaveGame = () => {
    if (gameState === "PLAYING" && !window.confirm("게임이 진행 중입니다. 정말 나갈까요?")) {
      return;
    }

    navigate("/");
  };

  const handleStartOrRestart = () => {
    savedScoreRef.current = false;
    startGame();
  };

  if (!hasValidEntry) {
    return null;
  }

  if (gameState === "FINISHED") {
    return (
      <GameFinishedView
        score={score}
        stats={stats}
        onRestart={handleStartOrRestart}
        onOpenRanking={() => navigate("/ranking")}
        styles={styles}
      />
    );
  }

  return (
    <GamePlayView
      gameState={gameState}
      currentBlock={currentBlock}
      currentStep={currentStep}
      totalSteps={totalSteps}
      nBack={nBack}
      score={score}
      combo={combo}
      blockDuration={blockDuration}
      earlyStep={earlyStep}
      onLeaveGame={handleLeaveGame}
      onStartOrRestart={handleStartOrRestart}
      onInput={handleInput}
      styles={styles}
    />
  );
}
