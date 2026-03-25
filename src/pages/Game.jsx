    import { useEffect, useRef } from "react";
    import { useLocation, useNavigate } from "react-router-dom";
    import { isValidGameConfig } from "../constants/gameConfig";
    import { useAuth } from "../contexts/useAuth";
    import { isEarlyStep } from "../game/judgement";
    import { useNBackEngine } from "../hooks/useNBackEngine";
    import { saveScore } from "../services/rankingApi";
    import styles from "./Game.module.css";

export default function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, nickname } = useAuth();
    const hasValidEntry = isValidGameConfig(location.state);
    const gameConfig = hasValidEntry
        ? location.state
        : {
            nBack: 2,
            totalSteps: 20,
            blockDuration: 2000,
        };
  const savedScoreRef = useRef(false);

  // 잘못된 진입은 홈으로 돌려보낸다.
  useEffect(() => {
        if (!hasValidEntry) {
        navigate("/", { replace: true });
        }
    }, [hasValidEntry, navigate]);

    const { nBack, totalSteps, blockDuration } = gameConfig;
    const { gameState, currentStep, score, combo, currentBlock, stats, startGame, handleInput } =
        useNBackEngine({ nBack, totalSteps, blockDuration });

    useEffect(() => {
        if (gameState === "PLAYING") {
        savedScoreRef.current = false;
        }
    }, [gameState]);

  useEffect(() => {
    if (gameState !== "FINISHED" || !currentUser || savedScoreRef.current) {
      return;
    }

    // 게임 종료 시 점수는 한 번만 저장한다.
    savedScoreRef.current = true;

        void saveScore(
        {
            uid: currentUser.uid,
            nickname: nickname || "Anonymous",
            photoURL: currentUser.photoURL || null,
        },
        score,
        nBack,
        );
    }, [currentUser, gameState, nBack, nickname, score]);

  useEffect(() => {
    // Space 입력을 버튼 클릭과 같은 행동으로 연결한다.
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

    // 진행 중 새로고침 이탈에만 경고를 건다.
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
        const avgReactionTime = stats.correct > 0 ? Math.round(stats.totalReactionTime / stats.correct) : 0;
        const answeredCount = stats.correct + stats.wrong + stats.miss;
        const accuracy = answeredCount > 0 ? Math.round((stats.correct / answeredCount) * 100) : 0;

        return (
        <div className={styles.container}>
            <div className={styles.resultCard}>
            <h1 className={styles.title}>게임 완료</h1>
            <div className={styles.scoreBoard}>
                <h2>
                최종 점수: <span className={styles.highlight}>{score}</span> PTS
                </h2>
                <p>최대 콤보: {stats.maxCombo}</p>
                <p>평균 반응 속도: {avgReactionTime} ms</p>
                <p>정확도: {accuracy}%</p>
                <hr className={styles.divider} />
                <p className={styles.detailStats}>
                정답: {stats.correct} | 오답: {stats.wrong} | 놓침: {stats.miss}
                </p>
            </div>
            <div className={styles.btnGroup}>
                <button onClick={handleStartOrRestart} className={styles.actionButton}>
                다시 하기
                </button>
                <button onClick={() => navigate("/ranking")} className={styles.secondaryButton}>
                랭킹 보기
                </button>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className={styles.container}>
        <div className={styles.backLink} onClick={handleLeaveGame}>
            게임 나가기
        </div>

        <div className={styles.card}>
            <div className={styles.header}>
            <div>
                <span className={styles.levelBadge}>{nBack}-BACK</span>
                <span className={styles.stepInfo}>
                {currentStep} / {totalSteps}
                </span>
            </div>
            <div className={styles.scoreInfo}>
                <span className={styles.scoreText}>{score} PTS</span>
            </div>
            </div>

            <div className={styles.timerTrack}>
            {gameState === "PLAYING" && (
                <div
                key={currentStep}
                className={styles.timerThumb}
                style={{ animationDuration: `${blockDuration}ms` }}
                />
            )}
            </div>

            <div className={styles.shapeBoard}>
            {gameState === "PLAYING" && currentBlock ? (
                <div className={styles.shapeWrapper}>
                <currentBlock.shape size="100" color={currentBlock.color} className={styles.popAnim} />
                </div>
            ) : (
                <span className={styles.readyText}>READY</span>
            )}
            </div>

            {gameState === "IDLE" ? (
            <button onClick={handleStartOrRestart} className={styles.actionButton}>
                게임 시작
            </button>
            ) : (
            <button
                onClick={handleInput}
                className={`${styles.actionButton} ${earlyStep ? styles.disabledButton : ""}`}
                disabled={earlyStep}
            >
                {earlyStep ? "기억하는 중..." : "일치 (Space)"}
            </button>
            )}

            {combo >= 3 && <div className={styles.floatingCombo}>{combo} COMBO!</div>}
        </div>
        </div>
    );
    }
