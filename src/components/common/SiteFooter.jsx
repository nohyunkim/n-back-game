import { useEffect, useState } from "react";
import styles from "./SiteFooter.module.css";

const CONTACT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeTvXMjJwLQMdF9P60OGEJQoVukt-T2NOpfAFBDYtDpTvELVw/viewform?usp=publish-editor";

const MODAL_CONTENT = {
  service: {
    title: "서비스 소개",
    sections: [
      {
        id: "overview",
        title: "서비스 개요",
        body:
          "N-Back Challenge는 작업 기억과 집중력 훈련을 목적으로 만든 브라우저 기반 N-Back 게임입니다. 로그인 없이도 바로 시작할 수 있고, 플레이 기록은 랭킹과 함께 확인할 수 있습니다.",
      },
      {
        id: "features",
        title: "주요 기능",
        body:
          "N-Back 단계, 문제 수, 제시 속도를 조절할 수 있으며 점수, 정확도, 평균 반응 속도, 랭킹을 함께 제공합니다. 안내 페이지에서 훈련 가이드와 기본 원리도 확인할 수 있습니다.",
      },
      {
        id: "scope",
        title: "이용 목적",
        body:
          "이 서비스는 개인 훈련과 기록 확인을 위한 도구입니다. 의료적 진단이나 치료 목적의 서비스는 아니며, 자신의 훈련 흐름을 가볍게 점검하는 용도로 사용하는 것을 권장합니다.",
      },
    ],
  },
  metrics: {
    title: "지표 해석 가이드",
    sections: [
      {
        id: "score",
        title: "점수 해석",
        body:
          "점수는 한 번의 최고 기록보다 최근 세션 흐름으로 보는 편이 좋습니다. 하루 컨디션과 난이도 설정에 따라 변동이 생길 수 있으므로 주간 단위 추세를 함께 확인하는 것이 더 유의미합니다.",
      },
      {
        id: "accuracy",
        title: "정확도 확인",
        body:
          "정확도가 낮게 흔들리면 현재 설정이 아직 몸에 익지 않았다는 신호일 수 있습니다. 속도를 올리기 전에 정확도를 먼저 안정시키는 편이 장기적으로 기록 유지에 도움이 됩니다.",
      },
      {
        id: "reaction",
        title: "반응 속도 보기",
        body:
          "반응 속도가 빠르더라도 오답과 미스가 함께 늘면 과도하게 서두르고 있을 가능성이 큽니다. 반응 속도는 정확도와 함께 해석해야 의미가 있습니다.",
      },
    ],
  },
  faq: {
    title: "자주 묻는 질문",
    sections: [
      {
        id: "start-level",
        title: "처음에는 어떤 설정으로 시작하면 좋나요?",
        body:
          "처음에는 1-Back 또는 2-Back에서 비교적 느린 속도로 시작하는 편이 좋습니다. 규칙에 익숙해진 뒤 정확도가 안정되면 단계나 속도를 천천히 높이는 방식을 권장합니다.",
      },
      {
        id: "low-score",
        title: "점수가 낮으면 훈련 효과가 없는 건가요?",
        body:
          "그렇지 않습니다. 같은 설정에서 정확도가 좋아지거나 규칙을 안정적으로 따라가는 과정도 충분한 변화입니다. 한두 번의 점수보다 반복 세션의 흐름을 보는 편이 적절합니다.",
      },
      {
        id: "policy-help",
        title: "정책이나 문의는 어디서 확인하나요?",
        body:
          "footer에서는 요약만 제공하고 있으며, 더 자세한 운영 안내와 개인정보 관련 내용은 정책 페이지에서 확인할 수 있습니다. 오류 제보나 문의는 별도 접수 링크로 받고 있습니다.",
      },
    ],
  },
  privacy: {
    title: "개인정보처리방침",
    sections: [
      {
        id: "summary",
        title: "요약 안내",
        body:
          "이 모달은 요약본입니다. 서비스는 계정 식별, 프로필 이미지, 닉네임, 점수 기록처럼 운영에 필요한 최소 정보만 사용하며, 자세한 보관 기준과 이용자 권리는 정책 페이지에서 확인할 수 있습니다.",
      },
      {
        id: "collection",
        title: "수집 정보",
        body:
          "Google 로그인 시 UID, 닉네임, 프로필 이미지와 점수 기록이 저장될 수 있습니다. 게스트 플레이는 즉시 이용을 위한 임시 세션 중심으로 동작합니다.",
      },
      {
        id: "details",
        title: "상세 문서 안내",
        body:
          "보관 기간, 처리 목적, 삭제 요청, 문의 경로 등은 정책 페이지에 정리해 두었습니다. 법적 안내가 필요한 경우 footer 요약보다 정책 페이지 문서를 우선 확인해 주세요.",
      },
    ],
  },
  terms: {
    title: "이용약관",
    sections: [
      {
        id: "changes",
        title: "서비스 변경",
        body:
          "서비스 기능과 화면 구성은 운영 상황에 따라 조정될 수 있습니다. 중요한 변경이 필요한 경우 서비스 내 안내나 관련 페이지를 통해 공지합니다.",
      },
      {
        id: "restrictions",
        title: "이용 제한",
        body:
          "비정상적인 방식으로 점수를 조작하거나 다른 이용자 경험을 방해하는 행위는 제한될 수 있습니다. 서비스 안정성을 해치는 자동화·우회 사용도 제한 대상입니다.",
      },
      {
        id: "details",
        title: "상세 문서 안내",
        body:
          "이 모달은 핵심 요약만 제공합니다. 이용 조건, 책임 제한, 문의 방법 등은 정책 페이지에서 조금 더 자세히 확인할 수 있습니다.",
      },
    ],
  },
};

export default function SiteFooter() {
  const [openKey, setOpenKey] = useState(null);
  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const activeModal = openKey ? MODAL_CONTENT[openKey] : null;

  useEffect(() => {
    if (!activeModal) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenKey(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal]);

  const openModal = (key) => {
    setOpenKey(key);
    setExpandedSectionId(MODAL_CONTENT[key]?.sections[0]?.id ?? null);
  };

  const closeModal = () => {
    setOpenKey(null);
    setExpandedSectionId(null);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.row} aria-label="Footer">
          <nav className={styles.nav} aria-label="Footer Links">
            <button type="button" className={styles.linkButton} onClick={() => openModal("service")}>
              서비스 소개
            </button>
            <button type="button" className={styles.linkButton} onClick={() => openModal("metrics")}>
              지표 해석 가이드
            </button>
            <button type="button" className={styles.linkButton} onClick={() => openModal("faq")}>
              자주 묻는 질문
            </button>
            <button type="button" className={styles.linkButton} onClick={() => openModal("privacy")}>
              개인정보처리방침
            </button>
            <button type="button" className={styles.linkButton} onClick={() => openModal("terms")}>
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
            <button type="button" className={styles.closeButton} onClick={closeModal} aria-label="닫기">
              ×
            </button>
            <h2 id="site-footer-modal-title" className={styles.modalTitle}>
              {activeModal.title}
            </h2>
            <div className={styles.accordion}>
              {activeModal.sections.map((section) => {
                const isOpen = expandedSectionId === section.id;

                return (
                  <div key={section.id} className={styles.accordionItem}>
                    <button
                      type="button"
                      className={styles.accordionTrigger}
                      onClick={() => setExpandedSectionId(isOpen ? null : section.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{section.title}</span>
                      <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    {isOpen && (
                      <div className={styles.accordionPanel}>
                        <p>{section.body}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
