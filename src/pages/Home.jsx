import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../components/common/ProfileModal";
import SiteFooter from "../components/common/SiteFooter";
import { DEFAULT_GAME_CONFIG, GAME_LIMITS, createGameConfig } from "../constants/gameConfig";
import { useAuth } from "../contexts/useAuth";
import { getDailyRanking } from "../services/rankingApi";
import { isInAppBrowser } from "../utils/browser";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, nickname, loginWithGoogle } = useAuth();
  const inAppBrowser = isInAppBrowser();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHowToFlipped, setIsHowToFlipped] = useState(false);
  const [topRanking, setTopRanking] = useState([]);
  const [showInAppNotice, setShowInAppNotice] = useState(inAppBrowser);

  const [nBack, setNBack] = useState(DEFAULT_GAME_CONFIG.nBack);
  const [totalSteps, setTotalSteps] = useState(DEFAULT_GAME_CONFIG.totalSteps);
  const [speed, setSpeed] = useState(DEFAULT_GAME_CONFIG.speed);

  // 홈에서는 랭킹 상위 3개만 미리 보여준다.
  useEffect(() => {
    getDailyRanking().then((data) => setTopRanking(data.slice(0, 3)));
  }, []);

  const handleLogin = () => {
    // 인앱 브라우저에서는 로그인 시도 대신 안내만 보여준다.
    if (inAppBrowser) {
      setShowInAppNotice(true);
      alert("카카오톡 같은 인앱 브라우저에서는 Google 로그인이 차단될 수 있어요. 기본 브라우저에서 다시 열어주세요.");
      return;
    }

    void loginWithGoogle();
  };

  const handleStart = () => {
    // 선택한 옵션을 라우터 state로 넘겨 게임을 시작한다.
    if (!currentUser) {
      alert("게임을 시작하려면 로그인이 필요합니다.");
      return;
    }

    navigate("/game", {
      state: createGameConfig({ nBack, totalSteps, speed }),
    });
  };

  return (
    <div className={styles.container}>
      {showInAppNotice && !currentUser && (
        <div className={styles.inAppNotice}>
          <div>
            <strong>인앱 브라우저에서는 Google 로그인이 막힐 수 있어요.</strong>
            <p>카카오톡에서 열었다면 메뉴에서 기본 브라우저로 열어주세요.</p>
          </div>
          <button type="button" className={styles.noticeClose} onClick={() => setShowInAppNotice(false)}>
            닫기
          </button>
        </div>
      )}

      <div className={styles.authBar}>
        {!currentUser ? (
          <button onClick={handleLogin} className={styles.loginBtn}>
            <span className={styles.googleIcon} aria-hidden="true">
              G
            </span>
            <span className={styles.loginText}>Google 계정으로 가입</span>
          </button>
        ) : (
          <div onClick={() => setIsProfileModalOpen(true)} className={styles.profileBadge}>
            <img src={currentUser.photoURL} alt="P" />
            <span>{nickname}</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>N-BACK CHALLENGE</h1>
          <p className={styles.subtitle}>집중력과 작업 기억을 훈련해보세요.</p>

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
                문제 수: <span>{totalSteps}</span>
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
                표시 속도: <span>{speed.toFixed(1)}초</span>
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
                    처음 <strong>{nBack}턴</strong>은 비교 대상이 없으니 순서를 기억하는 데 집중하면 됩니다.
                  </p>
                  <p>패턴을 차분히 보고 정확하게 맞혀서 콤보를 쌓아보세요.</p>
                </div>
                <button type="button" className={styles.flipButton} onClick={() => setIsHowToFlipped(true)}>
                  예시 보기
                </button>
              </div>

              <div className={`${styles.howToFace} ${styles.howToBack}`}>
                <div className={styles.howToContent}>
                  <h3>{nBack}-Back 예시</h3>
                  <p className={styles.exampleLine}>예시 순서: ● → ▲ → ● → ■</p>
                  <p>2-Back 기준에서는 3번째 ●가 2칸 전의 ●와 같으므로 그 순간 누르면 됩니다.</p>
                  <p>지금 선택한 {nBack}-Back은 항상 {nBack}칸 전 도형과 비교한다고 생각하면 돼요.</p>
                </div>
                <button type="button" className={styles.flipButton} onClick={() => setIsHowToFlipped(false)}>
                  규칙 다시 보기
                </button>
              </div>
            </div>
          </section>

          <section className={styles.miniRank}>
            <h3>오늘의 Top 3</h3>
            <div className={styles.rankList}>
              {topRanking.length > 0 ? (
                topRanking.map((rankingItem, index) => (
                  <div key={rankingItem.id} className={styles.rankRow}>
                    <span>
                      {index + 1}. {rankingItem.nickname}
                    </span>
                    <b>{rankingItem.score}</b>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>아직 기록이 없습니다.</p>
              )}
            </div>
            <button onClick={() => navigate("/ranking")} className={styles.moreBtn}>
              전체 랭킹 보기
            </button>
          </section>
        </div>
      </div>

      {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
      <SiteFooter />
    </div>
  );
}
