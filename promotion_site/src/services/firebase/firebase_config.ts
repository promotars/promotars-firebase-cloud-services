import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: "AIzaSyAJIH6br8wRLROTqukpQJ92X2XZz1ayVXM",
    authDomain: "promotars-prod.firebaseapp.com",
    databaseURL: "https://promotars-prod-default-rtdb.firebaseio.com",
    projectId: "promotars-prod",
    storageBucket: "promotars-prod.appspot.com",
    messagingSenderId: "352154748068",
    appId: "1:352154748068:web:6596382679fa67672fd231",
    measurementId: "G-B7YZWNSSZT"
});

export const db = getFirestore(app)

