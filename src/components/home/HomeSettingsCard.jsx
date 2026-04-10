import { GAME_LIMITS } from "../../constants/gameConfig";

export default function HomeSettingsCard({
  nBack,
  totalSteps,
  speed,
  onNBackChange,
  onTotalStepsChange,
  onSpeedChange,
  onStart,
  styles,
}) {
  return (
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
            onChange={(event) => onNBackChange(Number(event.target.value))}
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
            onChange={(event) => onTotalStepsChange(Number(event.target.value))}
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
            onChange={(event) => onSpeedChange(Number(event.target.value))}
          />
        </div>
      </div>

      <button onClick={onStart} className={styles.startBtn}>
        게임 시작
      </button>
    </div>
  );
}
