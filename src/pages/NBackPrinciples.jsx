import { Link } from "react-router-dom";
import styles from "./InfoPage.module.css";

export default function NBackPrinciples() {
  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <h1 className={styles.title}>N-Back 원리와 기대할 수 있는 변화</h1>
        <p className={styles.subtitle}>
          N-Back은 작업 기억(Working Memory)을 지속적으로 사용하게 만드는 과제로, 짧은 시간 동안
          정보를 유지하고 갱신하는 습관을 훈련하는 데 도움을 줄 수 있습니다.
        </p>

        <section className={styles.section}>
          <h2>N-Back이 훈련하는 능력</h2>
          <p>
            화면에 순차적으로 제시되는 자극을 보면서 현재 자극과 n단계 이전 자극을 비교해야 하므로,
            집중 유지와 정보 업데이트가 동시에 요구됩니다.
          </p>
          <ul>
            <li>주의 전환 없이 일정 시간 집중 유지하기</li>
            <li>직전 정보에 집착하지 않고 새 정보로 작업 기억 갱신하기</li>
            <li>충동 반응을 줄이고 정확한 판단 타이밍 잡기</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>점수 해석 시 주의할 점</h2>
          <p>
            단일 세션 점수는 피로도, 수면, 스트레스의 영향을 크게 받습니다. 따라서 하루 최고점만 보기보다
            최근 3일 평균과 최근 1주 추세를 함께 보는 편이 안정적입니다.
          </p>
          <ul>
            <li>정확도가 80% 미만이면 난이도를 낮춰 정확도를 먼저 회복</li>
            <li>정확도 85% 이상이 3일 유지되면 난이도 또는 속도를 한 단계 상향</li>
            <li>반응속도만 빠르고 오답이 증가하면 과속 반응 신호로 해석</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>한계와 현실적인 목표</h2>
          <p>
            N-Back 점수가 높아졌다고 해서 모든 인지 능력이 동일하게 향상되는 것은 아닙니다. 실생활 전이는
            개인차가 크기 때문에, 학습이나 업무 습관 개선과 병행하는 것이 좋습니다.
          </p>
          <p>
            이 서비스는 의학적 진단 도구가 아니며, 훈련 기록을 스스로 점검하는 보조 도구로 활용하는 것을
            권장합니다.
          </p>
        </section>

        <nav className={styles.footerLinks}>
          <Link to="/">홈으로</Link>
          <Link to="/guide">훈련 가이드</Link>
          <Link to="/policy">운영 정책</Link>
        </nav>
      </article>
    </main>
  );
}