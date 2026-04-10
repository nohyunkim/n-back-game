import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SiteFooter from "../components/common/SiteFooter";
import RankingHero from "../components/ranking/RankingHero";
import RankingPanel from "../components/ranking/RankingPanel";
import RankingTabs from "../components/ranking/RankingTabs";
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

  const ranking = activeTab === "daily" ? dailyRanking : allTimeRanking;

  return (
    <div className={styles.container}>
      <button type="button" className={styles.backIconButton} onClick={() => navigate("/")} aria-label="뒤로 가기">
        <FaArrowLeft aria-hidden="true" />
      </button>

      <RankingHero styles={styles} />
      <RankingTabs activeTab={activeTab} onChange={setActiveTab} styles={styles} />

      {loading ? (
        <p className={styles.loadingText}>기록을 불러오는 중...</p>
      ) : (
        <RankingPanel activeTab={activeTab} ranking={ranking} styles={styles} />
      )}
      <SiteFooter />
    </div>
  );
}
