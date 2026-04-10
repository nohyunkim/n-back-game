export default function GamePlayView({
  gameState,
  currentBlock,
  currentStep,
  totalSteps,
  nBack,
  score,
  combo,
  blockDuration,
  earlyStep,
  onLeaveGame,
  onStartOrRestart,
  onInput,
  styles,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.backLink} onClick={onLeaveGame}>
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
          <button onClick={onStartOrRestart} className={styles.actionButton}>
            게임 시작
          </button>
        ) : (
          <button
            onClick={onInput}
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
