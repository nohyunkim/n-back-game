import { useCallback, useEffect, useRef, useState } from "react";
import { didMissMatch, isEarlyStep, isMatchingStep } from "../game/judgement";
import {
  applyCorrectInput,
  applyMissPenalty,
  applyWrongInput,
  calculateBaseScore,
  createInitialStats,
} from "../game/scoring";
import { generateSequence, getSymbolCount } from "../game/sequence";

export const useNBackEngine = (config) => {
  const { nBack = 2, totalSteps = 30, blockDuration = 2000 } = config;
  const symbolCount = getSymbolCount(nBack);

  const [gameState, setGameState] = useState("IDLE");
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [stats, setStats] = useState(createInitialStats);

  const engineRef = useRef({ sequence: [], matchIndices: new Set(), stepStartTime: 0, hasAnsweredThisStep: false });
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const statsRef = useRef(createInitialStats());

  const syncRoundState = useCallback((nextState) => {
    scoreRef.current = nextState.score;
    comboRef.current = nextState.combo;
    statsRef.current = nextState.stats;

    setScore(nextState.score);
    setCombo(nextState.combo);
    setStats(nextState.stats);
  }, []);

  const baseScore = calculateBaseScore({ nBack, blockDuration });

  const nextStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= totalSteps) {
        setGameState("FINISHED");
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        return;
      }

      if (
        didMissMatch({
          stepIndex,
          matchIndices: engineRef.current.matchIndices,
          hasAnswered: engineRef.current.hasAnsweredThisStep,
        })
      ) {
        syncRoundState(
          applyMissPenalty({
            score: scoreRef.current,
            stats: statsRef.current,
            baseScore,
          }),
        );
      }

      engineRef.current.hasAnsweredThisStep = false;
      engineRef.current.stepStartTime = Date.now();
      setCurrentBlock(engineRef.current.sequence[stepIndex]);
      stepRef.current = stepIndex + 1;
      setCurrentStep(stepIndex + 1);
    },
    [baseScore, syncRoundState, totalSteps],
  );

  const startGame = useCallback(() => {
    const { sequence, matchIndices } = generateSequence({ totalSteps, nBack, symbolCount });
    engineRef.current.sequence = sequence;
    engineRef.current.matchIndices = matchIndices;
    engineRef.current.hasAnsweredThisStep = false;

    const initialStats = createInitialStats();
    scoreRef.current = 0;
    comboRef.current = 0;
    statsRef.current = initialStats;

    setScore(0);
    setCombo(0);
    setStats(initialStats);
    setCurrentStep(0);
    stepRef.current = 0;
    setGameState("PLAYING");
    nextStep(0);
  }, [nBack, nextStep, symbolCount, totalSteps]);

  useEffect(() => {
    if (gameState !== "PLAYING") {
      return () => clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      nextStep(stepRef.current);
    }, blockDuration);

    return () => clearInterval(timerRef.current);
  }, [blockDuration, gameState, nextStep]);

  const handleInput = useCallback(() => {
    if (
      gameState !== "PLAYING" ||
      engineRef.current.hasAnsweredThisStep ||
      isEarlyStep({ currentStep, nBack })
    ) {
      return;
    }

    engineRef.current.hasAnsweredThisStep = true;
    const reactionTime = Date.now() - engineRef.current.stepStartTime;

    if (isMatchingStep({ currentStep, matchIndices: engineRef.current.matchIndices })) {
      syncRoundState(
        applyCorrectInput({
          score: scoreRef.current,
          combo: comboRef.current,
          stats: statsRef.current,
          baseScore,
          reactionTime,
        }),
      );
      return;
    }

    syncRoundState(
      applyWrongInput({
        score: scoreRef.current,
        stats: statsRef.current,
        baseScore,
      }),
    );
  }, [baseScore, currentStep, gameState, nBack, syncRoundState]);

  return {
    gameState,
    currentStep,
    totalSteps,
    score,
    combo,
    currentBlock,
    stats,
    blockDuration,
    startGame,
    handleInput,
  };
};
