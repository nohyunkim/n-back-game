import { useEffect, useState } from "react";
import { FaArrowLeft, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SiteFooter from "../components/common/SiteFooter";
import { getAllTimeRanking, getDailyRanking } from "../services/rankingApi";
import styles from "./Ranking.module.css";

export default function Ranking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("daily");
  const [dailyRanking, setDailyRanking] = useState([]);
  const [allTimeRanking, setAllTimeRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const [dailyData, allTimeData] = await Promise.all([getDailyRanking(), getAllTimeRanking()]);
      setDailyRanking(dailyData);
      setAllTimeRanking(allTimeData);
      setLoading(false);
    };

    void fetchRanking();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${(index + 1).toString().padStart(2, "0")}`;
  };

  const ranking = activeTab === "daily" ? dailyRanking : allTimeRanking;
  const emptyText =
    activeTab === "daily" ? "오늘 등록된 기록이 없습니다." : "아직 누적 랭킹 기록이 없습니다.";

  return (
    <div className={styles.container}>
      <button type="button" className={styles.backIconButton} onClick={() => navigate("/")} aria-label="홈으로 돌아가기">
        <FaArrowLeft aria-hidden="true" />
      </button>

      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <FaTrophy aria-hidden="true" />
        </div>
        <div>
          <p className={styles.eyebrow}>RANKING BOARD</p>
          <h1 className={styles.title}>랭킹</h1>
        </div>
      </div>

      <div className={styles.tabBar} role="tablist" aria-label="랭킹 종류">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "daily"}
          className={`${styles.tabButton} ${activeTab === "daily" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("daily")}
        >
          오늘 랭킹 TOP 10
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "allTime"}
          className={`${styles.tabButton} ${activeTab === "allTime" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("allTime")}
        >
          전체 TOP 10
        </button>
      </div>

      {loading ? (
        <p className={styles.loadingText}>기록을 불러오는 중...</p>
      ) : (
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
                  <img src={item.photoURL} alt="프로필" className={styles.profileImage} />
                  <div className={styles.userMeta}>
                    <span className={styles.nickname}>{item.nickname}</span>
                    <span className={styles.subMeta}>
                      {activeTab === "daily" ? "오늘 최고 기록" : `${item.dateString ?? "누적"} 기록`}
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
      )}
      <SiteFooter />
    </div>
  );
}
