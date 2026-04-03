import { useState } from "react";
import styles from "./SiteFooter.module.css";

const CONTACT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeTvXMjJwLQMdF9P60OGEJQoVukt-T2NOpfAFBDYtDpTvELVw/viewform?usp=publish-editor";

const MODAL_CONTENT = {
  service: {
    title: "서비스 소개",
    body: [
      "N-Back Challenge는 작업 기억과 집중력 훈련을 위한 브라우저 기반 N-Back 게임입니다.",
      "로그인 후 기록한 점수는 일일 랭킹에 반영되며, 자신의 훈련 흐름을 가볍게 확인할 수 있습니다.",
      "의료적 진단이나 치료 목적이 아닌 개인 훈련용 서비스로 운영됩니다.",
    ],
  },
  metrics: {
    title: "지표 해석 가이드",
    body: [
      "점수는 한 번의 결과보다 최근 며칠간의 흐름으로 보는 편이 더 정확합니다.",
      "정답률이 자주 흔들리면 난도나 속도가 아직 맞지 않는 경우가 많으니 먼저 안정적인 정확도를 만드는 것이 좋습니다.",
      "반응 속도가 빨라도 오답이 함께 늘어나면 무리한 플레이일 수 있어 정확도와 속도를 같이 확인하는 편이 좋습니다.",
    ],
  },
  faq: {
    title: "자주 묻는 질문",
    body: [
      "처음에는 1-Back 또는 2-Back에서 짧은 세션으로 시작하는 것이 부담이 적습니다.",
      "점수가 낮더라도 같은 설정에서 정확도가 조금씩 안정되면 훈련이 진행되고 있는 것으로 볼 수 있습니다.",
      "정책, 개인정보, 이용 조건은 푸터 항목에서 바로 확인할 수 있고, 문의는 오류 제보 링크를 통해 접수할 수 있습니다.",
    ],
  },
  privacy: {
    title: "개인정보처리방침",
    body: [
      "Google 로그인 과정에서 UID, 프로필 이름, 사진 URL을 받아 계정 식별과 랭킹 표시에 사용합니다.",
      "게임 점수와 플레이 날짜는 랭킹 제공과 기록 확인을 위해 저장됩니다.",
      "민감정보는 별도로 수집하지 않으며, 서비스 운영 목적 외 용도로 개인정보를 판매하거나 제공하지 않습니다.",
    ],
  },
  terms: {
    title: "이용약관",
    body: [
      "서비스는 예고 없이 일부 기능이 변경되거나 일시 중단될 수 있습니다.",
      "비정상적인 방법으로 점수를 조작하거나 다른 이용자에게 피해를 주는 행위는 제한될 수 있습니다.",
      "정책이 바뀌는 경우 서비스 내 안내를 통해 내용을 고지합니다.",
    ],
  },
};

export default function SiteFooter() {
  const [openKey, setOpenKey] = useState(null);
  const activeModal = openKey ? MODAL_CONTENT[openKey] : null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setOpenKey(null);
    }
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.row} aria-label="Footer">
          <nav className={styles.nav} aria-label="Footer Links">
          <button type="button" className={styles.linkButton} onClick={() => setOpenKey("service")}>
            서비스 소개
          </button>
          <button type="button" className={styles.linkButton} onClick={() => setOpenKey("metrics")}>
            지표 해석 가이드
          </button>
          <button type="button" className={styles.linkButton} onClick={() => setOpenKey("faq")}>
            자주 묻는 질문
          </button>
          <button type="button" className={styles.linkButton} onClick={() => setOpenKey("privacy")}>
            개인정보처리방침
          </button>
          <button type="button" className={styles.linkButton} onClick={() => setOpenKey("terms")}>
            이용약관
          </button>
          <a href={CONTACT_URL} target="_blank" rel="noreferrer" className={styles.link}>
            문의/오류 제보
          </a>
          </nav>
        </div>
        <p className={styles.copy}>© 2026 N-Back Challenge. All Rights Reserved.</p>
      </footer>

      {activeModal && (
        <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="site-footer-modal-title">
            <button type="button" className={styles.closeButton} onClick={() => setOpenKey(null)} aria-label="닫기">
              ×
            </button>
            <h2 id="site-footer-modal-title" className={styles.modalTitle}>
              {activeModal.title}
            </h2>
            <div className={styles.modalBody}>
              {activeModal.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
