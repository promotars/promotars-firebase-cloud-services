import { ReCaptchaV3Provider, initializeAppCheck } from "@firebase/app-check";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: "AIzaSyAJIH6br8wRLROTqukpQJ92X2XZz1ayVXM",
    authDomain: "promotars-prod.firebaseapp.com",
    databaseURL: "https://promotars-prod-default-rtdb.firebaseio.com",
    projectId: "promotars-prod",
    storageBucket: "promotars-prod.appspot.com",
    messagingSenderId: "352154748068",
    appId: "1:352154748068:web:dda7466fd5f580282fd231",
    measurementId: "G-77P4S8W7KJ"
});

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LcT17gpAAAAAIW9S8yzfH3Rf7OGN9diyxzpQ6wn'),
    isTokenAutoRefreshEnabled: true
});

export const db = getFirestore(app)
export default appCheck;

