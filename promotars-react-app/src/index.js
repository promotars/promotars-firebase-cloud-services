import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from "firebase/app-check";
import md5 from "md5";
import { getFunctions, httpsCallable } from "firebase/functions";

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

// IIFE
(async () => {
  try {
    const isValidClick = checkIfClickIsValid();
    console.log("isValidClick - " + isValidClick);
    if (isValidClick === false) {
      return redirectUserToLandingURL(getStoredLandingURL());
    }
    const promotionId = validateAndGetPromotionId();
    if (promotionId === null) {
      console.log("promotionId is null");
      return redirectToHomePage();
    }
    const db = initFirebaseDB();
    const promotionData = await getPromotionData(db, promotionId);
    if (promotionData === null) {
      console.log("promotionData is null");
      return redirectToHomePage();
    }
    const campaignId = promotionData.campaign_id;
    // fetch campaign details
    const campaignData = await getCampaignData(db, campaignId);
    const _isCampaignLocationBased = isCampaignLocationBased(campaignData);

    var objectForCF = {};
    if (_isCampaignLocationBased) {
      // fetch user's lat long
      const loc = await fetchUsersLatLong();
      // TODO: add 50 km's radius logic
      objectForCF.lat = loc.lat;
      objectForCF.long = loc.long;
    }
    objectForCF.unique_id = getUniqueID();
    objectForCF.promotion_id = promotionId;
    console.log(objectForCF);
    // TODO: will CF successfully run if await is removed?
    await callBusinessClickFunction(objectForCF);
    storeLandingURL(campaignData.landing_uri || "");
    redirectUserToLandingURL(campaignData.landing_uri || "");
  } catch (e) {
    console.error("error occured " + e);
  }
})();



function checkIfClickIsValid() {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return true;
  }
  let isValid = false;
  const key = "dddd";
  var storedDate = localStorage[key] || "0";
  if (storedDate === "0") {
    isValid = true;
  } else {
    var storedDatee = new Date(parseInt(storedDate));
    var currentDate = new Date();
    const diffInMilliSeconds = currentDate.getTime() - storedDatee;
    const inHours = diffInMilliSeconds / 3600000;
    console.log("inHours - "+inHours);
    isValid = inHours > 1;
  }
  // set time
  var d1 = new Date();
  localStorage.setItem(key, d1.getTime());
  return isValid;
}

function storeLandingURL(url){
  localStorage.setItem("LandingURL", url);
}

function getStoredLandingURL(){
  return localStorage["LandingURL"] || "";
}

function validateAndGetPromotionId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const promotionId = urlParams.get('id') || "";
  if (promotionId.length === 0) {
    console.error("promotionId is empty");
    return null;
  }
  return promotionId;
}

function redirectToHomePage() {
  console.log("redirectToHomePage");
  // window.location.replace("https://promotars-prod.web.app?redirect=true");
}

function getUniqueID() {
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

  // // match with stored, if mismatch then user is trying to mock user agent
  // // so if exist in Local Storage use that data
  // console.log("currentUserAgent", currentUserAgent);
  // console.log("viewportWidth", viewportWidth);
  // console.log("viewportHeight", viewportHeight);
  // // console.log("screenWidth", screenWidth);
  // // console.log("screenHeight", screenHeight);
  // console.log("devicePixelRatio", devicePixelRatio);
  // console.log("userLanguage", userLanguage);
  // console.log("maxTouchPoints", maxTouchPoints);

  const id = currentUserAgent.concat(
    viewportWidth,
    viewportHeight,
    // screenWidth,
    // screenHeight,
    devicePixelRatio,
    userLanguage,
    maxTouchPoints
  );

  return md5(id);
}


function initFirebaseDB() {
  const app = firebase.initializeApp({
    apiKey: "AIzaSyAJIH6br8wRLROTqukpQJ92X2XZz1ayVXM",
    authDomain: "promotars-prod.firebaseapp.com",
    databaseURL: "https://promotars-prod-default-rtdb.firebaseio.com",
    projectId: "promotars-prod",
    storageBucket: "promotars-prod.appspot.com",
    messagingSenderId: "352154748068",
    appId: "1:352154748068:web:6596382679fa67672fd231",
    measurementId: "G-B7YZWNSSZT"
  });

  // const appCheck = initializeAppCheck(app, {
  //   provider: new ReCaptchaV3Provider(
  //     "6LdAdlwpAAAAAFvxMCpDkxQhk6Ve2tbqxd1qkhV6"
  //   ),
  //   // provider: new ReCaptchaV3Provider(process.env.REACT_APP_APP_CHECK_RECAPTCHA_SITEKEY),
  //   isTokenAutoRefreshEnabled: true,
  // });

  const appCheck = initializeAppCheck(app, {
    provider: new CustomProvider({
      getToken: () => {
        return Promise.resolve({
          token: "6LdAdlwpAAAAAFvxMCpDkxQhk6Ve2tbqxd1qkhV6",
          expireTimeMillis: Date.now() + 1000 * 60 * 60 * 24, // 1 day
        });
      }
    }),
    isTokenAutoRefreshEnabled: true,
  });
  return app.firestore();
}

async function getPromotionData(db, promotionId) {
  try {
    var promotionData = null;
    const data = await db.collection("influencer_promotions")
      .where("promotion_id", "==", promotionId)
      .limit(1)
      .get();

    if (!data.empty) {
      data.forEach(element => {
        if (promotionData === null) {
          promotionData = element.data();
        }
      });
      return promotionData;
    }
  } catch (e) {
    console.log("Error In getPromotionData E - " + e);
  }
  return promotionData;
}


async function getCampaignData(db, campaignId) {
  try {
    const data = await db.collection("campaigns")
      .doc(campaignId)
      .get();

    if (data.exists) {
      return data.data();
    }
  } catch (e) {
    console.log("Error In getCampaignData E - " + e);
  }
}

function isCampaignLocationBased(campaignData) {
  const list = Array.from(campaignData.target_locations);
  return list.length > 0;
}

async function fetchUsersLatLong() {
  try {
    // TODO: get token from ENV
    const response = await fetch("https://ipinfo.io?token=d96f9cd8658639");
    if (response.ok) {
      const data = await response.json();
      const { loc } = data;
      const [latitude, longitude] = loc.split(',');
      return { "lat": latitude, "long": longitude };
    }


  } catch (error) {
    console.error('Error fetching location:', error);
  }

}

async function callBusinessClickFunction(params) {
  const businessLinkClickCall = httpsCallable(getFunctions(), 'businessLinkClick');
  try {
    await businessLinkClickCall(params);
  } catch (error) {
    console.log("error in CF call - " + error);
  };
}

function redirectUserToLandingURL(url) {
  console.log("redirectUserToLandingURL - url - "+url);
  if (url.toString().length !== 0) {
    // BOTH - opens in current tab with back button option
    window.open(url,"_self");
    // window.location.replace(url);
  } else {
    console.log("landing url does not exist");
    redirectToHomePage();
  }
}