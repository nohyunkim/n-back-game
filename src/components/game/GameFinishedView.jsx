export default function GameFinishedView({ score, stats, onRestart, onOpenRanking, styles }) {
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
          <button onClick={onRestart} className={styles.actionButton}>
            다시 하기
          </button>
          <button onClick={onOpenRanking} className={styles.secondaryButton}>
            랭킹 보기
          </button>
        </div>
      </div>
    </div>
  );
}
