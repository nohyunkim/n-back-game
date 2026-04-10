import { Link } from "react-router-dom";
import SiteFooter from "../components/common/SiteFooter";
import styles from "./InfoPage.module.css";

const CONTACT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeTvXMjJwLQMdF9P60OGEJQoVukt-T2NOpfAFBDYtDpTvELVw/viewform?usp=publish-editor";

export default function SitePolicy() {
  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.topNav}>
          <Link to="/" className={styles.backButton}>
            홈으로
          </Link>
          <nav className={styles.tabs}>
            <Link to="/about-nback" className={styles.tabLink}>
              원리
            </Link>
            <Link to="/guide" className={styles.tabLink}>
              훈련 루틴
            </Link>
            <Link to="/policy" className={`${styles.tabLink} ${styles.tabActive}`}>
              정책/문의
            </Link>
          </nav>
        </header>

        <h1 className={styles.title}>운영 정책 및 개인정보 안내</h1>
        <p className={styles.subtitle}>
          본 페이지는 N-Back Challenge의 운영 기준, 개인정보 처리 범위, 이용 조건, 문의 경로를 정리한
          안내 문서입니다. footer의 모달은 요약본이며, 이 페이지는 조금 더 자세한 기준을 제공합니다.
        </p>

        <section id="summary" className={styles.section}>
          <h2>문서 개요</h2>
          <p>최종 수정일: 2026년 4월 10일</p>
          <p>
            N-Back Challenge는 브라우저에서 바로 이용할 수 있는 인지 훈련용 게임 서비스입니다. 이용자는
            게스트 상태로 즉시 플레이하거나 Google 로그인으로 기록을 보다 안정적으로 관리할 수 있습니다.
          </p>
        </section>

        <section id="service" className={styles.section}>
          <h2>서비스 운영 기준</h2>
          <p>
            서비스는 개인의 훈련 기록 확인과 반복 플레이를 위한 목적으로 제공됩니다. 의료적 진단, 치료,
            임상 평가를 위한 서비스는 아니며, 게임 결과는 참고 지표로 해석하는 것을 권장합니다.
          </p>
          <p>
            서비스 기능, 화면 구성, 제공 방식은 운영 상황에 따라 일부 변경될 수 있으며, 중요한 변경이
            필요한 경우 서비스 화면 또는 관련 안내 페이지를 통해 고지합니다.
          </p>
        </section>

        <section id="privacy" className={styles.section}>
          <h2>수집 및 저장되는 정보</h2>
          <ul>
            <li>Google 로그인 이용 시 계정 식별자(UID)</li>
            <li>닉네임, 프로필 이미지 URL 등 공개 프로필 정보</li>
            <li>게임 점수, N-Back 단계, 세션 기록 일자 등 플레이 기록</li>
            <li>게스트 플레이 시 임시 세션 식별에 필요한 최소 정보</li>
          </ul>
          <p>
            서비스는 민감정보를 별도로 요구하지 않으며, 운영에 필요하지 않은 개인정보를 추가로 수집하는
            것을 지향하지 않습니다.
          </p>
        </section>

        <section id="purpose" className={styles.section}>
          <h2>정보 이용 목적</h2>
          <ul>
            <li>사용자 식별 및 프로필 표시</li>
            <li>랭킹, 점수 기록, 플레이 이력 제공</li>
            <li>중복 닉네임 방지 및 기본적인 서비스 무결성 유지</li>
            <li>문의 대응 및 오류 확인</li>
          </ul>
          <p>
            위 목적 외의 용도로 개인정보를 임의 활용하지 않으며, 광고성 목적으로 별도 제공하는 것을 기본
            운영 범위로 두지 않습니다.
          </p>
        </section>

        <section id="retention" className={styles.section}>
          <h2>보관 및 정리 기준</h2>
          <p>
            계정 기반 기록은 서비스 운영 중 랭킹 및 기록 조회를 위해 보관될 수 있습니다. 다만 서비스
            운영 종료, 구조 변경, 보관 필요성 감소 등의 사유가 있을 경우 관련 데이터는 합리적인 범위에서
            정리될 수 있습니다.
          </p>
          <p>
            게스트 세션은 로그인 계정보다 일시적인 성격이 강하며, 기기 환경이나 브라우저 상태에 따라
            지속성이 달라질 수 있습니다.
          </p>
        </section>

        <section id="rights" className={styles.section}>
          <h2>이용자 권리 및 유의사항</h2>
          <ul>
            <li>이용자는 언제든지 로그아웃하거나 서비스 이용을 중단할 수 있습니다.</li>
            <li>게스트 기록은 기기 또는 세션 환경 변화에 따라 유지되지 않을 수 있습니다.</li>
            <li>Google 로그인 기록은 계정 기반으로 보다 안정적으로 이어서 사용할 수 있습니다.</li>
            <li>정책 내용이 변경되면 본 페이지 기준으로 최신 내용을 확인할 수 있습니다.</li>
          </ul>
        </section>

        <section id="terms" className={styles.section}>
          <h2>이용 제한 및 책임 범위</h2>
          <p>
            비정상적인 방식으로 점수를 조작하거나, 다른 이용자의 경험을 방해하거나, 서비스 안정성을 해치는
            자동화·우회 사용은 제한될 수 있습니다.
          </p>
          <p>
            서비스는 지속적인 개선을 목표로 하지만, 모든 환경에서 완전한 무중단 동작이나 기록 보존을
            보장하지는 않습니다. 이용자는 이를 이해한 범위에서 서비스를 사용해야 합니다.
          </p>
        </section>

        <section id="contact" className={styles.section}>
          <h2>문의 및 오류 제보</h2>
          <p>
            서비스 관련 문의, 오류 제보, 정책 관련 요청은 아래 접수 폼으로 전달할 수 있습니다. 접수된
            내용은 확인 후 운영 범위 내에서 검토합니다.
          </p>
          <p>
            <a href={CONTACT_URL} target="_blank" rel="noreferrer">
              문의 접수 폼 열기
            </a>
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
