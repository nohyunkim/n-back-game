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
        <nav className={styles.nav} aria-label="Footer">
          <button type="button" className={styles.linkButton} onClick={() => setOpenKey("service")}>
            서비스 소개
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
