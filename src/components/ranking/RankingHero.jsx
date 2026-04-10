import { FaTrophy } from "react-icons/fa";

export default function RankingHero({ styles }) {
  return (
    <div className={styles.hero}>
      <div className={styles.heroBadge}>
        <FaTrophy aria-hidden="true" />
      </div>
      <div>
        <p className={styles.eyebrow}>RANKING BOARD</p>
        <h1 className={styles.title}>랭킹</h1>
      </div>
    </div>
  );
}
