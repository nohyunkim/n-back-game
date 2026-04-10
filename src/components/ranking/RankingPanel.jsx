import { DEFAULT_PROFILE_IMAGE } from "../../constants/profile";

const getRankBadge = (index) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${(index + 1).toString().padStart(2, "0")}`;
};

export default function RankingPanel({ activeTab, ranking, styles }) {
  const emptyText =
    activeTab === "daily" ? "오늘 등록된 기록이 없습니다." : "아직 전체 랭킹 기록이 없습니다.";

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.panelLabel}>{activeTab === "daily" ? "TODAY" : "ALL TIME"}</p>
          <h2 className={styles.panelTitle}>{activeTab === "daily" ? "오늘 랭킹 TOP 10" : "전체 TOP 10"}</h2>
        </div>
      </div>

      <div className={styles.rankingList}>
        {ranking.length > 0 ? (
          ranking.map((item, index) => (
            <div key={item.id} className={styles.rankingItem}>
              <span className={styles.rankNumber}>{getRankBadge(index)}</span>
              <img src={item.photoURL || DEFAULT_PROFILE_IMAGE} alt="프로필" className={styles.profileImage} />
              <div className={styles.userMeta}>
                <span className={styles.nickname}>{item.nickname}</span>
                <span className={styles.subMeta}>
                  {activeTab === "daily" ? "오늘 최고 기록" : `${item.dateString ?? "전체"} 기록`}
                </span>
              </div>
              <span className={styles.score}>{item.score}점</span>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>{emptyText}</p>
        )}
      </div>
    </section>
  );
}
