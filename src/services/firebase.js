    // src/services/firebase.js
    import { initializeApp } from "firebase/app";
    import { getAuth, GoogleAuthProvider } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    // .env 파일에 숨겨둔 값들을 불러옵니다.
    const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    // Firebase 앱 초기화
    const app = initializeApp(firebaseConfig);

    // 우리가 사용할 도구들을 export 합니다.
    export const auth = getAuth(app);
    export const googleProvider = new GoogleAuthProvider();
    export const db = getFirestore(app); // Firestore 데이터베이스 도구