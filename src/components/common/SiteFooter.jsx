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
          "N-Back Challenge는 작업 기억과 집중력 훈련을 위한 브라우저 기반 N-Back 게임입니다. 간단한 규칙으로 반복 훈련을 진행하면서 자신의 기록 흐름을 확인할 수 있습니다.",
      },
      {
        id: "features",
        title: "제공 내용",
        body:
          "사용자는 난도와 속도를 조절해 플레이할 수 있고, 로그인 후에는 점수 기록과 일일 랭킹을 함께 확인할 수 있습니다. 홈 화면과 안내 페이지에서 기본적인 훈련 방법도 제공합니다.",
      },
      {
        id: "scope",
        title: "이용 목적",
        body:
          "이 서비스는 의료적 진단이나 치료 목적이 아닌 개인 훈련 및 기록 확인용으로 제공됩니다. 게임 형태의 인지 훈련 도구로 이해하는 것이 가장 적절합니다.",
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
          "점수는 한 번의 최고 기록보다 최근 며칠간의 흐름으로 보는 편이 더 정확합니다. 하루의 컨디션에 따라 단기 점수는 흔들릴 수 있으니 평균적인 추세를 함께 보는 것이 좋습니다.",
      },
      {
        id: "accuracy",
        title: "정확도 확인",
        body:
          "정답률이 자주 흔들리면 현재 난도나 속도가 아직 맞지 않는 경우가 많습니다. 이럴 때는 먼저 안정적인 정확도를 만드는 쪽이 다음 단계로 넘어가기보다 더 중요할 수 있습니다.",
      },
      {
        id: "reaction",
        title: "반응 속도 보기",
        body:
          "반응 속도가 빨라도 오답이 함께 늘어나면 무리한 플레이일 수 있어 정확도와 속도를 함께 확인하는 편이 좋습니다. 빠른 반응만으로 좋은 플레이를 판단하기는 어렵습니다.",
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
          "처음에는 1-Back 또는 2-Back에서 짧은 세션으로 시작하는 것이 부담이 적습니다. 속도도 너무 빠르게 두기보다 규칙을 익힐 수 있는 수준에서 시작하는 편이 좋습니다.",
      },
      {
        id: "low-score",
        title: "점수가 낮으면 훈련 효과가 없는 건가요?",
        body:
          "그렇지는 않습니다. 같은 설정에서 정확도가 조금씩 안정되거나 규칙에 익숙해지는 과정도 충분히 의미 있는 변화로 볼 수 있습니다.",
      },
      {
        id: "policy-help",
        title: "정책이나 문의는 어디서 확인하나요?",
        body:
          "개인정보 처리 안내와 이용 조건은 푸터 항목에서 바로 확인할 수 있으며, 문의는 오류 제보 링크를 통해 접수할 수 있습니다.",
      },
    ],
  },
  privacy: {
    title: "개인정보처리방침 요약",
    sections: [
      {
        id: "collected",
        title: "수집 항목",
        body:
          "Google 로그인 과정에서 UID, 프로필 이름, 사진 URL을 수집합니다. 서비스 사용 중에는 게임 점수와 플레이 날짜가 함께 기록될 수 있습니다.",
      },
      {
        id: "usage",
        title: "이용 목적",
        body:
          "수집한 정보는 계정 식별, 랭킹 표시, 기록 확인 등 서비스 운영에 필요한 범위 안에서 사용합니다.",
      },
      {
        id: "limits",
        title: "추가 안내",
        body:
          "민감정보는 별도로 수집하지 않으며, 운영 목적과 무관한 방식으로 개인정보를 판매하거나 임의 제공하지 않습니다.",
      },
    ],
  },
  terms: {
    title: "이용약관 요약",
    sections: [
      {
        id: "changes",
        title: "서비스 변경",
        body:
          "서비스는 운영 상황에 따라 예고 없이 일부 기능이 변경되거나 일시 중단될 수 있습니다.",
      },
      {
        id: "restrictions",
        title: "이용 제한",
        body:
          "비정상적인 방법으로 점수를 조작하거나 다른 이용자에게 피해를 주는 행위는 제한될 수 있습니다.",
      },
      {
        id: "notice",
        title: "고지 방식",
        body:
          "운영 정책이나 이용 조건이 바뀌는 경우 서비스 내 안내를 통해 관련 내용을 고지합니다.",
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
      setExpandedSectionId(null);
      return;
    }

    setExpandedSectionId(activeModal.sections[0]?.id ?? null);
  }, [activeModal]);

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
