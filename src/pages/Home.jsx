import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../components/common/ProfileModal";
import SiteFooter from "../components/common/SiteFooter";
import { DEFAULT_GAME_CONFIG, GAME_LIMITS, createGameConfig } from "../constants/gameConfig";
import { DEFAULT_PROFILE_IMAGE } from "../constants/profile";
import { useAuth } from "../contexts/useAuth";
import { getAllTimeRanking } from "../services/rankingApi";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, isGuest, nickname, loginWithGoogle } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHowToFlipped, setIsHowToFlipped] = useState(false);
  const [topRanking, setTopRanking] = useState([]);

  const [nBack, setNBack] = useState(DEFAULT_GAME_CONFIG.nBack);
  const [totalSteps, setTotalSteps] = useState(DEFAULT_GAME_CONFIG.totalSteps);
  const [speed, setSpeed] = useState(DEFAULT_GAME_CONFIG.speed);

  useEffect(() => {
    getAllTimeRanking().then((data) => setTopRanking(data.slice(0, 3)));
  }, []);

  const handleLogin = async () => {
    await loginWithGoogle();
  };

  const handleStart = () => {
    if (!currentUser) {
      alert("게스트 세션을 준비 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    navigate("/game", {
      state: createGameConfig({ nBack, totalSteps, speed }),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBar}>
        <div className={styles.authActions}>
          {currentUser && (
            <div
              onClick={isGuest ? undefined : () => setIsProfileModalOpen(true)}
              className={`${styles.profileBadge} ${isGuest ? `${styles.profileBadgeStatic} ${styles.profileBadgeCompact}` : ""}`}
            >
              <img src={currentUser.photoURL || DEFAULT_PROFILE_IMAGE} alt="프로필" />
              <span>{nickname}</span>
            </div>
          )}
          {(!currentUser || isGuest) && (
            <button onClick={handleLogin} className={styles.loginBtn}>
              <span className={styles.googleIcon} aria-hidden="true">
                G
              </span>
              <span className={styles.loginText}>{isGuest ? "Google 로그인 연결" : "Google 계정으로 계속"}</span>
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>N-BACK CHALLENGE</h1>
          <p className={styles.subtitle}>게스트로 바로 시작하고, 원하면 나중에 Google 계정으로 연결할 수 있습니다.</p>

          <div className={styles.settings}>
            <div className={styles.settingItem}>
              <label>
                기억 단계: <span>{nBack}-Back</span>
              </label>
              <input
                type="range"
                min={GAME_LIMITS.nBack.min}
                max={GAME_LIMITS.nBack.max}
                step={GAME_LIMITS.nBack.step}
                value={nBack}
                onChange={(event) => setNBack(Number(event.target.value))}
              />
            </div>

            <div className={styles.settingItem}>
              <label>
                문제 수 <span>{totalSteps}</span>
              </label>
              <input
                type="range"
                min={GAME_LIMITS.totalSteps.min}
                max={GAME_LIMITS.totalSteps.max}
                step={GAME_LIMITS.totalSteps.step}
                value={totalSteps}
                onChange={(event) => setTotalSteps(Number(event.target.value))}
              />
            </div>

            <div className={styles.settingItem}>
              <label>
                제시 속도: <span>{speed.toFixed(1)}초</span>
              </label>
              <input
                type="range"
                min={GAME_LIMITS.speed.min}
                max={GAME_LIMITS.speed.max}
                step={GAME_LIMITS.speed.step}
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              />
            </div>
          </div>

          <button onClick={handleStart} className={styles.startBtn}>
            게임 시작
          </button>
        </div>

        <div className={styles.sideInfo}>
          <section className={styles.howTo}>
            <div className={`${styles.howToInner} ${isHowToFlipped ? styles.howToFlipped : ""}`}>
              <div className={`${styles.howToFace} ${styles.howToFront}`}>
                <div className={styles.howToContent}>
                  <h3>게임 방법</h3>
                  <p>
                    지금 보이는 도형이 <strong>{nBack}칸 전</strong> 도형과 같으면 <strong>Space</strong>를 누르세요.
                  </p>
                  <p>
                    처음 <strong>{nBack}번</strong>은 비교 대상이 없으니 먼저 순서를 기억하는 데 집중하면 됩니다.
                  </p>
                  <p>속도보다 정확도를 먼저 맞추면 콤보를 더 안정적으로 이어갈 수 있습니다.</p>
                </div>
                <button type="button" className={styles.flipButton} onClick={() => setIsHowToFlipped(true)}>
                  예시 보기
                </button>
              </div>

              <div className={`${styles.howToFace} ${styles.howToBack}`}>
                <div className={styles.howToContent}>
                  <h3>{nBack}-Back 예시</h3>
                  <p className={styles.exampleLine}>예시 순서: ● ▲ ●</p>
                  <p>2-Back 기준에서는 세 번째 도형이 두 칸 전 도형과 같으므로 그 순간 입력하면 됩니다.</p>
                  <p>현재 설정은 {nBack}-Back이므로 항상 {nBack}칸 전 도형과 비교한다고 생각하면 됩니다.</p>
                </div>
                <button type="button" className={styles.flipButton} onClick={() => setIsHowToFlipped(false)}>
                  규칙 다시 보기
                </button>
              </div>
            </div>
          </section>

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
            <button onClick={() => navigate("/ranking")} className={styles.moreBtn}>
              랭킹 보러 가기
            </button>
          </section>
        </div>
      </div>

      {!isGuest && isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
      <SiteFooter />
    </div>
  );
}
