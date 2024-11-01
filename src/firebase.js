import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXTSQjv3PNU5W5DS6IHic2giQQq2u_O94",
  authDomain: "lego-73686.firebaseapp.com",
  projectId: "lego-73686",
  storageBucket: "lego-73686.appspot.com",
  messagingSenderId: "758321857556",
  appId: "1:758321857556:web:a796ea64d3f874685e9301"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore(); // Firestore 인스턴스 초기화

export { firebase, auth, db }; // firebase, auth, db를 export
