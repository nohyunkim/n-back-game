import { Link } from "react-router-dom";
import SiteFooter from "../components/common/SiteFooter";
import styles from "./InfoPage.module.css";

export default function NBackPrinciples() {
  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.topNav}>
          <Link to="/" className={styles.backButton}>홈으로</Link>
          <nav className={styles.tabs}>
            <Link to="/about-nback" className={`${styles.tabLink} ${styles.tabActive}`}>원리</Link>
            <Link to="/guide" className={styles.tabLink}>훈련 루틴</Link>
            <Link to="/policy" className={styles.tabLink}>정책/문의</Link>
          </nav>
        </header>

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
          <h2>왜 생각보다 어렵게 느껴질까</h2>
          <p>
            N-Back은 단순히 같은 모양을 찾는 게임이 아니라, 현재 자극을 보는 동시에 직전 흐름을 계속
            갱신해야 하는 과제입니다. 그래서 체감 난이도는 낮은 단계에서도 빠르게 올라갈 수 있습니다.
          </p>
          <ul>
            <li>현재 화면에 시선이 끌리면 n단계 전 정보가 쉽게 사라짐</li>
            <li>속도가 빨라질수록 기억보다 반사 입력이 먼저 나오기 쉬움</li>
            <li>세션 후반에는 피로 누적으로 오답보다 놓침이 늘 수 있음</li>
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
          <h2>훈련 효과를 볼 때 더 중요한 기준</h2>
          <p>
            처음에는 최고 점수보다 규칙을 안정적으로 따라가는 빈도와 정확도 회복 속도를 보는 편이 더
            현실적입니다. 같은 난이도에서 실수가 줄고 흐름이 안정되면 그것도 충분한 변화입니다.
          </p>
          <ul>
            <li>초반 실수 횟수 감소</li>
            <li>후반 집중력 유지 시간 증가</li>
            <li>비슷한 설정에서 정확도 변동 폭 감소</li>
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

      </article>
      <SiteFooter />
    </main>
  );
}
