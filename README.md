# N-Back Challenge

React + Vite 기반의 웹 N-Back 훈련 서비스입니다.  
Google 로그인 후 게임을 플레이하고, Firebase Firestore에 점수를 저장해 일일 랭킹과 전체 랭킹을 보여줍니다.

## 주요 기능

- `1~5 Back` 난이도 조절
- 문제 수 조절 (`10~50`, 10단위)
- 문제 표시 속도 조절 (`1.0~4.0초`)
- 키보드 `Space` 또는 버튼 입력 지원
- 콤보, 정확도, 평균 반응 속도 결과 제공
- Google 로그인 및 프로필 기반 닉네임 관리
- 인앱 브라우저 대응 Google 로그인 (`popup` 실패 시 `redirect` fallback)
- 홈 화면 `전체 Top 3` 미리보기
- `오늘 랭킹 Top 10` / `전체 Top 10` 탭 제공
- 푸터 정책/안내 모달 제공
  - 서비스 소개
  - 지표 해석 가이드
  - 자주 묻는 질문
  - 개인정보처리방침 요약
  - 이용약관 요약

## 기술 스택

- React 19
- Vite
- React Router
- Firebase Authentication
- Firebase Firestore
- React Icons
- CSS Modules

## 화면 구성

### 홈

- 게임 옵션 설정
- 게임 방법 안내 카드
- 전체 Top 3 미리보기
- Google 로그인 / 프로필 진입
- 하단 푸터 정책/안내 모달

### 게임

- N-Back 규칙에 따라 도형과 색상을 기억
- 현재 단계, 점수, 타이머, 콤보 표시
- 게임 종료 후 점수 요약 제공

### 랭킹

- 오늘 날짜 기준 Top 10 랭킹 표시
- 누적 최고 기록 기준 전체 Top 10 랭킹 표시
- 사용자 프로필 이미지와 닉네임 표시

### 안내 페이지

- N-Back 원리와 한계
- 7일 훈련 루틴
- 운영 정책 및 문의 페이지

## 시작 방법

```bash
npm install
npm run dev
```

## 사용 가능한 스크립트

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 환경 변수

루트의 `.env` 파일에 아래 값을 설정해야 합니다.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Firebase 데이터 구조

### `users`

- `uid`
- `displayName`
- `photoURL`
- `nickname`
- `email`
- `createdAt`

### `scores`

- `uid`
- `nickname`
- `photoURL`
- `score`
- `nBack`
- `dateString`
- `timestamp`

점수는 `uid_YYYY-MM-DD` 형식의 문서 ID로 저장되며, 같은 날에는 더 높은 점수만 갱신됩니다.  
전체 랭킹은 `scores` 컬렉션 전체에서 사용자별 최고 점수 1개만 반영해 집계합니다.

## 현재 상태

- 홈, 게임, 랭킹, 안내 페이지 흐름이 동작 중
- 홈 화면과 랭킹 화면 UI 정리 완료
- 인앱 브라우저에서 Google 로그인 fallback 적용
- 푸터 정책/안내 항목은 모달 팝업으로 확인 가능
- `Esc` 키로 모달 닫기 지원
- `npm run lint`
- `npm run build` 확인 완료

## 다음에 보면 좋은 것

- 실제 배포 화면 기준 모바일 푸터 레이아웃 점검
- 정책/이용약관 전문 페이지를 별도로 둘지 결정
- README에 스크린샷 또는 배포 주소 추가
