export default function HomeMiniRanking({ topRanking, onOpenRanking, styles }) {
  return (
    <section className={styles.miniRank}>
      <h3>전체 Top 3</h3>
      <div className={styles.rankList}>
        {topRanking.length > 0 ? (
          topRanking.map((rankingItem, index) => (
            <div key={rankingItem.id} className={styles.rankRow}>
              <span className={styles.rankName}>
                {index + 1}. {rankingItem.nickname}
              </span>
              <b>{rankingItem.score}점</b>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>아직 기록이 없습니다.</p>
        )}
      </div>
      <button onClick={onOpenRanking} className={styles.moreBtn}>
        랭킹 보러 가기
      </button>
    </section>
  );
}
