import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDailyRanking } from "../services/rankingApi";
import styles from "./Ranking.module.css";

export default function Ranking() {
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await getDailyRanking();
      setRanking(data);
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>오늘의 TOP 10</h1>

      {loading ? (
        <p className={styles.loadingText}>기록을 불러오는 중...</p>
      ) : (
        <div className={styles.rankingList}>
          {ranking.length > 0 ? (
            ranking.map((item, index) => (
              <div key={item.id} className={styles.rankingItem}>
                <span className={styles.rankNumber}>{getRankBadge(index)}</span>
                <img src={item.photoURL} alt="프로필" className={styles.profileImage} />
                <span className={styles.nickname}>{item.nickname}</span>
                <span className={styles.score}>{item.score}점</span>
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>오늘 등록된 기록이 없습니다.</p>
          )}
        </div>
      )}

      <button className={styles.backButton} onClick={() => navigate("/")}>
        홈으로 돌아가기
      </button>
    </div>
  );
}
