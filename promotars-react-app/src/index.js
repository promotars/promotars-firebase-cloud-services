import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from "firebase/app-check";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

try {
  function validatePromotionId() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const promotionId = urlParams.get('id') || "";
    if (promotionId.length === 0) {
      console.error("promotionId is empty");
      // redirect to homepage
      redirectToHomePage();
      return "";
    } else {
      console.log("promotionId " + promotionId);
    }
  }

  function redirectToHomePage() {
    // window.location.replace("https://promotars-prod.web.app?redirect=true");
  }
  function handleUserAdClick() {
    // User Agent:
    const currentUserAgent = navigator.userAgent;
    // Viewport Dimensions:
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    // // Screen Dimensions: NOT Working in React
    // const screenWidth = screen.width;
    // const screenHeight = screen.height;
    // Device Pixel Ratio:
    const devicePixelRatio = window.devicePixelRatio;
    // Language Preferences:
    const userLanguage = navigator.language;
    // Touch Support:
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    // match with stored, if mismatch then user is trying to mock user agent
    // so if exist in Local Storage use that data
    console.log("currentUserAgent", currentUserAgent);
    console.log("viewportWidth", viewportWidth);
    console.log("viewportHeight", viewportHeight);
    // console.log("screenWidth", screenWidth);
    // console.log("screenHeight", screenHeight);
    console.log("devicePixelRatio", devicePixelRatio);
    console.log("userLanguage", userLanguage);
    console.log("maxTouchPoints", maxTouchPoints);

    const idUnique = currentUserAgent.concat(
      viewportWidth,
      viewportHeight,
      // screenWidth,
      // screenHeight,
      devicePixelRatio,
      userLanguage,
      maxTouchPoints
    );

    console.log("idUnique - " + idUnique);

    // update businessLinkClick CF
  }
  validatePromotionId();

  const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  });
  

  // const appCheck = initializeAppCheck(app, {
  //   provider: new ReCaptchaV3Provider(
  //     "6LdAdlwpAAAAAFvxMCpDkxQhk6Ve2tbqxd1qkhV6"
  //   ),
  //   // provider: new ReCaptchaV3Provider(process.env.REACT_APP_APP_CHECK_RECAPTCHA_SITEKEY),
  //   isTokenAutoRefreshEnabled: true,
  // });
  if (process.env.NODE_ENV === "development") {
  const appCheck = initializeAppCheck(app, {
    provider: new CustomProvider({
      getToken: () => {
        return Promise.resolve({
          token: "6LdAdlwpAAAAAFvxMCpDkxQhk6Ve2tbqxd1qkhV6",
          expireTimeMillis: Date.now() + 1000 * 60 * 60*24, // 1 day
        });
      }
    }),
    isTokenAutoRefreshEnabled: true,
  });
  console.log("appCheck dev" + appCheck);
  
}else{
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      "6LdAdlwpAAAAAFvxMCpDkxQhk6Ve2tbqxd1qkhV6"
    ),
    isTokenAutoRefreshEnabled: true,
  });
  console.log("appCheck prod" + appCheck);
}

  const db = app.firestore();
  console.log("db " + db);

  console.log("mode is " + process.env.NODE_ENV);

  db.collection("influencer_promotions")
  .where("influencer_id", "==", "af5o3dzZ32c1zoiOgT3yw8JAgzq2")
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // Access the document data using doc.data()
          console.log(doc.id, " => ", doc.data());
      });
  })
  .catch((error) => {
      console.error("Error getting documents: ", error);
  });

} catch (e) {
  console.error("error occured "+ e);
}
