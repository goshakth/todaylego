import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCV1l2UJx_iGwX0tC_kSX_5zoGGuH4hXsk",
    authDomain: "sasclubmn.firebaseapp.com",
    projectId: "sasclubmn",
    storageBucket: "sasclubmn.appspot.com",
    messagingSenderId: "805961519768",
    appId: "1:805961519768:web:db1d1e18285a1dadfeb6ed",
    measurementId: "G-BVQDK5JN7H"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore(); // Firestore 인스턴스 초기화

export { firebase, auth, db }; // firebase, auth, db를 export
