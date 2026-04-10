export default function HomeHowToCard({ nBack, isFlipped, onFlip, styles }) {
  return (
    <section className={styles.howTo}>
      <div className={`${styles.howToInner} ${isFlipped ? styles.howToFlipped : ""}`}>
        <div className={`${styles.howToFace} ${styles.howToFront}`}>
          <div className={styles.howToContent}>
            <h3>규칙</h3>
            <p>
              지금 보이는 도형이 <strong>{nBack}칸 전</strong> 도형과 같을 때만 <strong>Space</strong>를 누르세요.
            </p>
            <p>
              처음 <strong>{nBack}번</strong>은 비교할 대상이 없으니 순서를 먼저 기억하면 됩니다.
            </p>
            <p>같지 않으면 누르지 않고 넘기면 됩니다.</p>
          </div>
          <button type="button" className={styles.flipButton} onClick={() => onFlip(true)}>
            예시 보기
          </button>
        </div>

        <div className={`${styles.howToFace} ${styles.howToBack}`}>
          <div className={styles.howToContent}>
            <h3>{nBack}-Back 예시</h3>
            <p className={styles.exampleLine}>예시: ● -&gt; ▲ -&gt; ●</p>
            <p>2-Back이면 마지막 ●가 두 칸 전 ●와 같으므로 그 순간 입력하면 됩니다.</p>
            <p>현재는 {nBack}-Back이므로 항상 {nBack}칸 전 도형과만 비교하면 됩니다.</p>
          </div>
          <button type="button" className={styles.flipButton} onClick={() => onFlip(false)}>
            규칙 다시 보기
          </button>
        </div>
      </div>
    </section>
  );
}
