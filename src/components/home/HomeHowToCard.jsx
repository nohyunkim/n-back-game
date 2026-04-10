export default function HomeHowToCard({ nBack, isFlipped, onFlip, styles }) {
  return (
    <section className={styles.howTo}>
      <div className={`${styles.howToInner} ${isFlipped ? styles.howToFlipped : ""}`}>
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
          <button type="button" className={styles.flipButton} onClick={() => onFlip(true)}>
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
          <button type="button" className={styles.flipButton} onClick={() => onFlip(false)}>
            규칙 다시 보기
          </button>
        </div>
      </div>
    </section>
  );
}
