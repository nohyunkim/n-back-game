import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SiteFooter from "../components/common/SiteFooter";
import RankingHero from "../components/ranking/RankingHero";
import RankingPagination from "../components/ranking/RankingPagination";
import RankingPanel from "../components/ranking/RankingPanel";
import RankingTabs from "../components/ranking/RankingTabs";
import { getAllTimeRankingList, getDailyRankingList } from "../services/rankingApi";
import styles from "./Ranking.module.css";

const PAGE_SIZE = 10;

const getPageItems = (items, page) => {
  const startIndex = (page - 1) * PAGE_SIZE;
  return items.slice(startIndex, startIndex + PAGE_SIZE);
};

const getTotalPages = (items) => Math.max(Math.ceil(items.length / PAGE_SIZE), 1);

export default function Ranking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("daily");
  const [dailyRanking, setDailyRanking] = useState([]);
  const [allTimeRanking, setAllTimeRanking] = useState([]);
  const [dailyPage, setDailyPage] = useState(1);
  const [allTimePage, setAllTimePage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const [dailyData, allTimeData] = await Promise.all([getDailyRankingList(), getAllTimeRankingList()]);
      setDailyRanking(dailyData);
      setAllTimeRanking(allTimeData);
      setLoading(false);
    };

    void fetchRanking();
  }, []);

  const currentPage = activeTab === "daily" ? dailyPage : allTimePage;
  const ranking = activeTab === "daily" ? dailyRanking : allTimeRanking;
  const totalPages = getTotalPages(ranking);
  const pagedRanking = getPageItems(ranking, currentPage);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const handlePageChange = (nextPage) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);

    if (activeTab === "daily") {
      setDailyPage(safePage);
      return;
    }

    setAllTimePage(safePage);
  };

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
        <>
          <RankingPanel activeTab={activeTab} ranking={pagedRanking} startIndex={startIndex} styles={styles} />
          <RankingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            styles={styles}
          />
        </>
      )}
      <SiteFooter />
    </div>
  );
}
