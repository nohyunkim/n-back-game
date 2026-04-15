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
        paragraphs: [
          "N-Back Challenge는 작업 기억과 집중력 훈련을 목적으로 만든 브라우저 기반 N-Back 게임입니다. 설치 없이 바로 시작할 수 있고, 게스트 플레이와 Google 로그인 흐름을 모두 지원합니다.",
          "게임 자체를 빠르게 시작하는 경험을 유지하면서도, 사용자가 점수와 기록을 해석할 수 있도록 안내 페이지와 정책 페이지를 함께 제공합니다.",
        ],
      },
      {
        id: "features",
        title: "주요 기능",
        paragraphs: [
          "N-Back 단계, 문제 수, 제시 속도를 조절할 수 있으며 점수, 정확도, 평균 반응 속도, 랭킹을 함께 제공합니다.",
          "홈 화면에서는 바로 플레이를 시작할 수 있고, 별도 안내 페이지에서 기본 원리와 훈련 루틴을 확인할 수 있습니다.",
        ],
      },
      {
        id: "scope",
        title: "이용 목적",
        paragraphs: [
          "이 서비스는 개인 훈련과 기록 확인을 위한 도구입니다. 의료적 진단이나 치료 목적의 서비스는 아닙니다.",
          "따라서 결과는 자기 관찰과 훈련 습관 점검의 참고 자료로 활용하는 것을 권장합니다.",
        ],
      },
    ],
  },
  metrics: {
    title: "지표 해석 가이드",
    sections: [
      {
        id: "score",
        title: "점수 해석",
        paragraphs: [
          "점수는 한 번의 최고 기록보다 최근 세션 흐름으로 보는 편이 좋습니다. 하루 컨디션과 난이도 설정에 따라 변동이 생길 수 있으므로 주간 단위 추세를 함께 확인하는 것이 더 유의미합니다.",
          "특히 속도를 높인 직후에는 점수보다 정확도가 먼저 흔들릴 수 있어, 최고 점수만으로 상태를 판단하지 않는 편이 좋습니다.",
        ],
      },
      {
        id: "accuracy",
        title: "정확도 확인",
        paragraphs: [
          "정확도가 낮게 흔들리면 현재 설정이 아직 몸에 익지 않았다는 신호일 수 있습니다. 속도를 올리기 전에 정확도를 먼저 안정시키는 편이 장기적으로 기록 유지에 도움이 됩니다.",
          "같은 난이도에서 정확도가 며칠 안정적으로 유지되면 그때 단계나 속도를 천천히 높이는 방식이 더 현실적입니다.",
        ],
      },
      {
        id: "reaction",
        title: "반응 속도 보기",
        paragraphs: [
          "반응 속도가 빠르더라도 오답과 미스가 함께 늘면 과도하게 서두르고 있을 가능성이 큽니다. 반응 속도는 정확도와 함께 해석해야 의미가 있습니다.",
          "빠른 반응보다 일관된 판단 타이밍을 유지하는 것이 장기적으로 더 좋은 기록 흐름으로 이어집니다.",
        ],
      },
    ],
  },
  faq: {
    title: "자주 묻는 질문",
    sections: [
      {
        id: "start-level",
        title: "처음에는 어떤 설정으로 시작하면 좋나요?",
        paragraphs: [
          "처음에는 1-Back 또는 2-Back에서 비교적 느린 속도로 시작하는 편이 좋습니다. 규칙에 익숙해진 뒤 정확도가 안정되면 단계나 속도를 천천히 높이는 방식을 권장합니다.",
          "초반에는 높은 점수보다 규칙을 끝까지 흔들리지 않고 유지하는 것이 더 중요합니다.",
        ],
      },
      {
        id: "low-score",
        title: "점수가 낮으면 훈련 효과가 없는 건가요?",
        paragraphs: [
          "그렇지 않습니다. 같은 설정에서 정확도가 좋아지거나 규칙을 안정적으로 따라가는 과정도 충분한 변화입니다.",
          "한두 번의 점수보다 반복 세션의 흐름, 놓침 패턴, 후반 집중력 유지 여부를 함께 보는 편이 적절합니다.",
        ],
      },
      {
        id: "policy-help",
        title: "정책이나 문의는 어디서 확인하나요?",
        paragraphs: [
          "footer 모달은 요약 안내 역할을 합니다. 더 자세한 운영 안내와 개인정보 관련 내용은 정책 페이지에서 확인할 수 있습니다.",
          "오류 제보나 문의는 아래 문의/오류 제보 항목에서 접수 링크와 안내를 확인할 수 있습니다.",
        ],
      },
    ],
  },
  privacy: {
    title: "개인정보처리방침",
    sections: [
      {
        id: "summary",
        title: "요약 안내",
        paragraphs: [
          "이 모달은 요약본입니다. 서비스는 계정 식별, 프로필 이미지, 닉네임, 점수 기록처럼 운영에 필요한 최소 정보만 사용합니다.",
          "보다 자세한 보관 기준과 이용자 권리는 정책 페이지 문서를 우선 확인해 주세요.",
        ],
      },
      {
        id: "collection",
        title: "수집 정보",
        paragraphs: [
          "Google 로그인 시 UID, 닉네임, 프로필 이미지와 점수 기록이 저장될 수 있습니다.",
          "게스트 플레이는 즉시 이용을 위한 임시 세션 중심으로 동작하며, 환경에 따라 기록 지속성이 달라질 수 있습니다.",
        ],
      },
      {
        id: "usage",
        title: "이용 목적",
        paragraphs: [
          "수집된 정보는 사용자 식별, 프로필 표시, 랭킹 및 점수 기록 제공, 문의 대응과 오류 확인을 위해 사용됩니다.",
          "운영에 필요하지 않은 민감정보를 추가로 요구하는 방향은 기본 정책으로 두지 않습니다.",
        ],
      },
    ],
  },
  terms: {
    title: "이용약관",
    sections: [
      {
        id: "changes",
        title: "서비스 변경",
        paragraphs: [
          "서비스 기능과 화면 구성은 운영 상황에 따라 조정될 수 있습니다. 중요한 변경이 필요한 경우 서비스 내 안내나 관련 페이지를 통해 공지합니다.",
          "게임 밸런스, 랭킹 방식, 안내 문구 역시 사용성 개선을 위해 일부 수정될 수 있습니다.",
        ],
      },
      {
        id: "restrictions",
        title: "이용 제한",
        paragraphs: [
          "비정상적인 방식으로 점수를 조작하거나 다른 이용자 경험을 방해하는 행위는 제한될 수 있습니다.",
          "서비스 안정성을 해치는 자동화, 우회 사용, 반복적인 악용 역시 제한 대상입니다.",
        ],
      },
      {
        id: "responsibility",
        title: "책임 범위",
        paragraphs: [
          "서비스는 지속적인 개선을 목표로 하지만 모든 환경에서 완전한 무중단 동작이나 기록 보존을 보장하지는 않습니다.",
          "이용자는 이 점을 이해한 범위 안에서 서비스를 이용해야 하며, 결과는 참고용으로 활용하는 것이 적절합니다.",
        ],
      },
    ],
  },
  contact: {
    title: "문의/오류 제보",
    sections: [
      {
        id: "support",
        title: "어떤 내용을 보낼 수 있나요?",
        paragraphs: [
          "로그인 문제, 랭킹 오류, 점수 저장 이슈, 정책 관련 문의처럼 서비스 이용 중 확인이 필요한 내용을 전달할 수 있습니다.",
          "재현 가능한 오류라면 사용한 기기 환경이나 발생 상황을 함께 적어 주면 확인에 도움이 됩니다.",
        ],
      },
      {
        id: "response",
        title: "확인 방식",
        paragraphs: [
          "접수된 내용은 운영 범위 안에서 순차적으로 확인합니다. 모든 요청에 즉시 대응을 보장할 수는 없지만, 반복적으로 발생하는 문제는 우선적으로 점검합니다.",
          "문의 내용에 따라 안내 페이지나 정책 문서의 설명을 추가로 보강할 수 있습니다.",
        ],
      },
      {
        id: "link",
        title: "접수 링크",
        paragraphs: ["아래 링크를 통해 문의 또는 오류 제보를 남길 수 있습니다."],
        linkLabel: "문의 접수 폼 열기",
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
            <button type="button" className={styles.linkButton} onClick={() => openModal("contact")}>
              문의/오류 제보
            </button>
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
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        {section.linkLabel && (
                          <p>
                            <a href={CONTACT_URL} target="_blank" rel="noreferrer" className={styles.inlineLink}>
                              {section.linkLabel}
                            </a>
                          </p>
                        )}
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
