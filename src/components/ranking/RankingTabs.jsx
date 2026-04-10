export default function RankingTabs({ activeTab, onChange, styles }) {
  return (
    <div className={styles.tabBar} role="tablist" aria-label="랭킹 종류">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "daily"}
        className={`${styles.tabButton} ${activeTab === "daily" ? styles.tabActive : ""}`}
        onClick={() => onChange("daily")}
      >
        오늘 랭킹 TOP
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "allTime"}
        className={`${styles.tabButton} ${activeTab === "allTime" ? styles.tabActive : ""}`}
        onClick={() => onChange("allTime")}
      >
        전체 TOP
      </button>
    </div>
  );
}
