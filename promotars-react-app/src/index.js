import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  CustomProvider,
} from "firebase/app-check";
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

var promotionId;
var db;
var campaignData;
var appDiv;

// IIFE
(async () => {
  try {
    promotionId = validateAndGetPromotionId();
    if (promotionId === null) {
      console.log("promotionId is null");
      return redirectToHomePage();
    }

    db = initFirebaseDB();
    fetchCampaignUIData();
  } catch (e) {
    console.error("error occured " + e);
  }
})();

async function fetchCampaignUIData() {
  campaignData = await getCampaignData(db, promotionId);
  if (campaignData == null) {
    return redirectToHomePage();
  }
  

  processUI(campaignData);
}

function processUI(campaignData){

  const companyName = campaignData.business_name;
  const adTitle = campaignData.caption;
  displayCompanyNameAndAdCaptionText(companyName, adTitle);

  const type = campaignData.media_type;
  const isImage = type === "image";
  const mediaUri = campaignData.media_uri;
  displayVideo("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");
  // if (mediaUri != null) {
  //   if (isImage) {
  //     displayImage(mediaUri);
  //   } else {
  //     displayVideo(mediaUri);
  //   }
  // }
  activateProceedButton();
}

function displayCompanyNameAndAdCaptionText(companyName, adTitle) {
  document.getElementById("title").textContent = companyName;
  document.getElementById("subtitle").textContent = adTitle;
}

function displayImage(mediaUri) {  
  const imgElement = document.createElement("img");
  imgElement.src = mediaUri;
  imgElement.alt = "Today's Image"; // Set alt attribute for accessibility
  imgElement.classList.add("image");
  document.querySelector(".media-container").appendChild(imgElement);
}

function displayVideo(mediaUri) {
  const videoElement = document.createElement("video");
  videoElement.src = mediaUri;
  videoElement.controls = true;
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.classList.add("video"); 
  document.querySelector(".media-container").appendChild(videoElement);
  videoElement.play();
}


function activateProceedButton() {
  document.getElementById("proceed").addEventListener("click", function() {
    proceedClicked();
  });
}

async function proceedClicked() {
  // const isValidClick = checkIfClickIsValid(promotionId);

  // const db = initFirebaseDB();

  if (campaignData == null) {
    return redirectToHomePage();
  }
  const _isCampaignLocationBased = isCampaignLocationBased(campaignData);
  var objectForCF = {};
  if (_isCampaignLocationBased) {
    // fetch user's lat long
    const loc = await fetchUsersLatLong();
    // TODO: add 50 km's radius logic
    if(loc != null){
      objectForCF.lat = loc.lat;
      objectForCF.long = loc.long;
    }
  }
  objectForCF.unique_id = getUniqueID();
  objectForCF.promotion_id = promotionId;
  // TODO: will CF successfully run if await is removed?
  await callBusinessClickFunction(objectForCF);
  // storeLandingURL(campaignData.landing_uri || "", promotionId);
  redirectUserToLandingURL(campaignData.landing_uri || "");
}

function checkIfClickIsValid(promotionId) {
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //   return true;
  // }
  let isValid = false;
  const key = promotionId;
  var storedDate = localStorage[key] || "0";
  if (storedDate === "0") {
    isValid = true;
  } else {
    var storedDatee = new Date(parseInt(storedDate));
    var currentDate = new Date();
    const diffInMilliSeconds = currentDate.getTime() - storedDatee;
    const inHours = diffInMilliSeconds / 3600000;
    isValid = inHours > 1;
  }
  // set time
  var d1 = new Date();
  localStorage.setItem(key, d1.getTime());
  return isValid;
}

function storeLandingURL(url, promotionId) {
  localStorage.setItem(promotionId + "LandingURL", url);
}

function getStoredLandingURL(promotionId) {
  return localStorage[promotionId + "LandingURL"] || "";
}

function validateAndGetPromotionId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const promotionId = urlParams.get("id") || "";
  if (promotionId.length === 0) {
    console.log("promotionId is empty");
    return null;
  }
  return promotionId;
}

function redirectToHomePage() {
  console.log("redirectToHomePage");
  // window.location.replace(process.env.REACT_APP_HOMEPAGE_URL);
}

function getUniqueID() {
  // User Agent:
  const currentUserAgent = navigator.userAgent;
  // Viewport Dimensions:
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio;
  // Language Preferences:
  const userLanguage = navigator.language;
  // Touch Support:
  const maxTouchPoints = navigator.maxTouchPoints || 0;
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
    apiKey: process.env.REACT_APP_Firebase_apiKey,
    authDomain: process.env.REACT_APP_Firebase_authDomain,
    databaseURL: process.env.REACT_APP_Firebase_databaseURL,
    projectId: process.env.REACT_APP_Firebase_projectId,
    storageBucket: process.env.REACT_APP_Firebase_storageBucket,
    messagingSenderId: process.env.REACT_APP_Firebase_messagingSenderId,
    appId: process.env.REACT_APP_Firebase_appId,
    measurementId: process.env.REACT_APP_Firebase_measurementId,
  });

  // const appCheck = initializeAppCheck(app, {
  //   provider: new ReCaptchaV3Provider(
  //     process.env.REACT_APP_reCaptchaKey
  //   ),
  //   // provider: new ReCaptchaV3Provider(process.env.REACT_APP_APP_CHECK_RECAPTCHA_SITEKEY),
  //   isTokenAutoRefreshEnabled: true,
  // });

  // const appCheck = initializeAppCheck(app, {
  //   provider: new CustomProvider({
  //     getToken: () => {
  //       return Promise.resolve({
  //         token: process.env.REACT_APP_reCaptchaKey,
  //         expireTimeMillis: Date.now() + 1000 * 60 * 60 * 24, // 1 day
  //       });
  //     }
  //   }),
  //   isTokenAutoRefreshEnabled: true,
  // });
  return app.firestore();
}

async function getPromotionData(db, promotionId) {
  try {
    var promotionData = null;
    const data = await db
      .collection("influencer_promotions")
      .where("promotion_id", "==", promotionId)
      .limit(1)
      .get();

    if (!data.empty) {
      data.forEach((element) => {
        if (promotionData === null) {
          promotionData = element.data();
        }
      });
      return promotionData;
    } else {
      console.log("getPromotionData not found");
    }
  } catch (e) {
    console.log("Error In getPromotionData E - " + e);
  }
  return promotionData;
}

async function getCampaignData(db, promotionId) {
  const promotionData = await getPromotionData(db, promotionId);
  if (promotionData === null) {
    console.log("promotionData is null");
    return;
  }
  const campaignId = promotionData.campaign_id;
  // fetch campaign details
  try {
    const data = await db.collection("campaigns").doc(campaignId).get();

    if (data.exists) {
      return data.data();
    } else {
      console.log("getCampaignData not found");
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
    const response = await fetch(
      "https://ipinfo.io?token=" + process.env.REACT_APP_ipKey
    );
    if (response.ok) {
      const data = await response.json();
      const { loc } = data;
      const [latitude, longitude] = loc.split(",");
      return { lat: latitude, long: longitude };
    }else{
      console.log("unable to fetchUsersLatLong");
    }
  } catch (error) {
    console.error("Error fetching location:", error);
  }
}

async function callBusinessClickFunction(params) {
  const businessLinkClickCall = httpsCallable(
    getFunctions(),
    "businessLinkClick"
  );
  try {
    await businessLinkClickCall(params);
  } catch (error) {
    console.log("error in CF call - " + error);
  }
}

function redirectUserToLandingURL(url) {
  console.log("redirectUserToLandingURL - url - " + url);
  if (url.toString().length !== 0) {
    // BOTH - opens in current tab with back button option
    window.open(url, "_self");
    // window.location.replace(url);
  } else {
    console.log("landing url does not exist");
    redirectToHomePage();
  }
}
