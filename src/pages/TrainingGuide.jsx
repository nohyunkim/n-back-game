import { Link } from "react-router-dom";
import SiteFooter from "../components/common/SiteFooter";
import styles from "./InfoPage.module.css";

export default function TrainingGuide() {
  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.topNav}>
          <Link to="/" className={styles.backButton}>홈으로</Link>
          <nav className={styles.tabs}>
            <Link to="/about-nback" className={styles.tabLink}>원리</Link>
            <Link to="/guide" className={`${styles.tabLink} ${styles.tabActive}`}>훈련 루틴</Link>
            <Link to="/policy" className={styles.tabLink}>정책/문의</Link>
          </nav>
        </header>

        <h1 className={styles.title}>7일 N-Back 훈련 가이드</h1>
        <p className={styles.subtitle}>
          훈련 강도를 무리하게 올리기보다 정확도와 반응속도를 균형 있게 관리하는 것이 중요합니다. 아래
          루틴은 하루 10~15분 기준의 입문용 플랜입니다.
        </p>

        <section className={styles.section}>
          <h2>Day 1-2: 기준선 만들기</h2>
          <ul>
            <li>난이도: 1-Back 또는 2-Back</li>
            <li>목표: 규칙을 헷갈리지 않고 끝까지 플레이</li>
            <li>기록: 정확도, 오답 패턴(성급한 입력/놓침) 메모</li>
          </ul>
          <p>
            처음부터 점수를 끌어올리려 하기보다, 한 세션을 안정적으로 끝내는 감각을 만드는 것이 더
            중요합니다. 규칙이 자연스럽게 읽히기 시작하면 그다음부터 난이도 조절이 쉬워집니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Day 3-5: 정확도 안정화</h2>
          <ul>
            <li>정확도 80% 미만: 속도를 0.5초 늦추고 같은 난이도 유지</li>
            <li>정확도 85% 이상: 문제 수를 늘려 집중 지속 시간을 훈련</li>
            <li>오답이 급증하는 구간: 직전 3턴을 마음속으로 리허설</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Day 6-7: 단계적 상향</h2>
          <ul>
            <li>최근 3세션 평균 정확도 85% 이상이면 1단계 상향</li>
            <li>난이도 상승 직후 2세션은 점수보다 정확도 우선</li>
            <li>집중 저하가 느껴지면 즉시 세션 종료 후 휴식</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>추천 시작 설정</h2>
          <ul>
            <li>완전 처음: 1-Back, 20문제, 2.0초 전후</li>
            <li>규칙은 이해했지만 놓침이 많을 때: 문제 수 유지, 속도만 0.5초 완화</li>
            <li>정확도는 안정적이지만 지루할 때: 난이도보다 문제 수를 먼저 증가</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>자주 나오는 실수</h2>
          <p>
            초반 n턴은 비교 대상이 없는데 반사적으로 입력하는 경우가 많습니다. 현재 화면을 빠르게 맞히려는
            전략보다, n턴 전 자극을 천천히 복기하는 전략이 장기적으로 점수와 정확도 모두에 유리합니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>세션 후 체크하면 좋은 것</h2>
          <ul>
            <li>오답보다 놓침이 많은지, 반대로 성급한 입력이 많은지</li>
            <li>후반으로 갈수록 정확도가 무너지는지</li>
            <li>속도를 낮추는 것이 맞는지, 난이도를 낮추는 것이 맞는지</li>
          </ul>
          <p>
            점수 하나만 보기보다 세션의 흔들리는 패턴을 같이 보면 다음 설정을 정하는 데 훨씬 도움이 됩니다.
          </p>
        </section>

      </article>
      <SiteFooter />
    </main>
  );
}
