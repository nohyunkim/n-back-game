# N-Back Game

React + Vite 기반의 웹 N-Back 게임입니다.  
Google 로그인 후 게임을 플레이하고, Firebase Firestore에 일일 최고 점수를 저장해 랭킹을 보여줍니다.

## 주요 기능

- `1~5 Back` 난이도 조절
- 문제 수 조절 (`10~50`, 10단위)
- 문제 표시 속도 조절 (`1.0~4.0초`)
- 키보드 `Space` 또는 버튼 입력 지원
- 콤보, 정확도, 평균 반응 속도 결과 제공
- Google 로그인 및 프로필 기반 닉네임 관리
- 일일 최고 점수 기준 `Top 10` 랭킹 제공

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
- How to Play 안내 카드
- 오늘의 Top 3 미리보기
- Google 로그인 / 프로필 진입

### 게임

- N-Back 규칙에 따라 도형과 색상을 기억
- 현재 단계, 점수, 타이머, 콤보 표시
- 게임 종료 후 점수 요약 제공

### 랭킹

- 오늘 날짜 기준 Top 10 랭킹 표시
- 사용자 프로필 이미지와 닉네임 표시

## 시작 방법

```bash
npm install
npm run dev
```

기본 개발 서버는 Vite 설정에 따라 로컬에서 실행됩니다.

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

## 현재 확인된 상태

- `main` 브랜치 기준 워킹트리는 깨끗함
- 게임, 랭킹, 로그인 흐름이 Firebase와 연결되어 있음
- `npm run lint` 는 현재 2개의 규칙 위반으로 실패함
- 샌드박스 제약 때문에 `npm run build` 는 이 환경에서 최종 확인하지 못함

## 개선 후보

- README에 실제 화면 스크린샷 추가
- `.env.example` 파일 분리
- 린트 오류 2건 정리
- 깨진 한글 문자열/인코딩 여부 점검
