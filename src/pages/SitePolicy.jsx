import { Link } from "react-router-dom";
import styles from "./InfoPage.module.css";

export default function SitePolicy() {
  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.topNav}>
          <Link to="/" className={styles.backButton}>홈으로</Link>
          <nav className={styles.tabs}>
            <Link to="/about-nback" className={styles.tabLink}>원리</Link>
            <Link to="/guide" className={styles.tabLink}>훈련 루틴</Link>
            <Link to="/policy" className={`${styles.tabLink} ${styles.tabActive}`}>정책/문의</Link>
          </nav>
        </header>

        <h1 className={styles.title}>운영 정책 및 개인정보 안내</h1>
        <p className={styles.subtitle}>
          본 페이지는 서비스 운영 기준, 데이터 저장 범위, 이용자 권리 안내를 목적으로 제공됩니다.
        </p>

        <section className={styles.section}>
          <h2>서비스 목적</h2>
          <p>
            N-Back Challenge는 인지 훈련을 위한 웹 기반 게임 서비스입니다. 이용자는 로그인 후 점수를
            기록하고 일일 랭킹을 확인할 수 있습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>수집 및 저장되는 정보</h2>
          <ul>
            <li>Google 로그인 식별자(UID)</li>
            <li>프로필 닉네임 및 사진 URL</li>
            <li>게임 점수, 난이도, 기록 일자</li>
          </ul>
          <p>
            위 정보는 랭킹 제공과 사용자 식별 목적 외에는 사용하지 않습니다. 민감정보는 별도로 수집하지
            않습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2>이용자 권리</h2>
          <ul>
            <li>언제든지 로그아웃할 수 있습니다.</li>
            <li>서비스 중단 시 저장 데이터는 운영 정책에 따라 정리됩니다.</li>
            <li>정책 변경 시 본 페이지를 통해 고지합니다.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>문의</h2>
          <p>
            서비스 관련 문의는 아래 폼으로 접수해 주세요.
          </p>
          <p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeTvXMjJwLQMdF9P60OGEJQoVukt-T2NOpfAFBDYtDpTvELVw/viewform?usp=publish-editor"
              target="_blank"
              rel="noreferrer"
            >
              문의 접수 폼 열기
            </a>
          </p>
        </section>

      </article>
    </main>
  );
}