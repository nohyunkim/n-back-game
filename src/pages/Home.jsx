import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../components/common/ProfileModal";
import SiteFooter from "../components/common/SiteFooter";
import HomeAuthPanel from "../components/home/HomeAuthPanel";
import HomeHowToCard from "../components/home/HomeHowToCard";
import HomeMiniRanking from "../components/home/HomeMiniRanking";
import HomeSettingsCard from "../components/home/HomeSettingsCard";
import { DEFAULT_GAME_CONFIG, createGameConfig } from "../constants/gameConfig";
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
      <HomeAuthPanel
        currentUser={currentUser}
        isGuest={isGuest}
        nickname={nickname}
        onLogin={handleLogin}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        styles={styles}
      />

      <div className={styles.content}>
        <HomeSettingsCard
          nBack={nBack}
          totalSteps={totalSteps}
          speed={speed}
          onNBackChange={setNBack}
          onTotalStepsChange={setTotalSteps}
          onSpeedChange={setSpeed}
          onStart={handleStart}
          styles={styles}
        />

        <div className={styles.sideInfo}>
          <HomeHowToCard nBack={nBack} isFlipped={isHowToFlipped} onFlip={setIsHowToFlipped} styles={styles} />
          <HomeMiniRanking topRanking={topRanking} onOpenRanking={() => navigate("/ranking")} styles={styles} />
        </div>
      </div>

      {!isGuest && isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
      <SiteFooter />
    </div>
  );
}
