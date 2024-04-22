const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const axios = require("axios");

const firestore = admin.firestore();

module.exports = async (request) => {
  const promotionId = request.data.promotion_id;
  const uniqueId = request.data.unique_id;
  const recaptchaToken = request.data.recaptcha_key;
  const clientIp = request.rawRequest.headers["x-forwarded-for"];
  const isLocationBasedCampaign = request.data.is_location_based_campaign;
  logger.log("Client IP : "+clientIp);
  logger.log("Recaptch key : " + recaptchaToken);
  logger.log("isLocationBasedCampaign : "+isLocationBasedCampaign);
  //   logger.log("Promotion Id : "+promotionId);
  if (recaptchaToken != null && recaptchaToken.length > 0) {
    const secretKeyV3 = "6LcT17gpAAAAAH0hEQIBjGAf2GfNDHvIRnVrRTSx"; // Prod Key
    const recaptchaResponse = await axios.post("https://www.google.com/recaptcha/api/siteverify?secret=" + secretKeyV3 + "&response=" + recaptchaToken);

    logger.log("Captcha Score : " + recaptchaResponse.data.score);
    logger.log("Capcth action : " + recaptchaResponse.data.action);
    if (recaptchaResponse.data.success && recaptchaResponse.data.score > 0.75 && recaptchaResponse.data.action === "ad_click") {
      await firestore.runTransaction(async (transaction) => {
        let decrementCampaignBalanceQuota = false;
        let incrementUniqueClicks = false;
        let increaseUserLevel = false;

        let newReserve = 0;
        let influencerData;
        let increaseScoreClick = 0;

        const influencerPromotionData = await getInfluencerPromotionData(transaction, promotionId);
        if (influencerPromotionData == null) {
          logger.warn("influencerPromotionData is null");
          return;
        }

        const campaignId = influencerPromotionData.campaign_id;
        const influencerId = influencerPromotionData.influencer_id;

        let campaignData = null;
        if (isLocationBasedCampaign) {
          const remoteConfig = await fetchAndSetRemoteConfig();
          const serviceLocations = remoteConfig["ad_target_serviceable_locations"].defaultValue.value;
          campaignData = await getCampaignData(transaction, campaignId);
          if (!await isClickFromLocationRange(clientIp, JSON.parse(serviceLocations), campaignData)) {
            return;
          }
        }

        const isPromotionActive = verifyPromotionStatus(influencerPromotionData);
        // logger.log("isPromotionActive : "+isPromotionActive);
        if (isPromotionActive) {
          const isUniqueClick = await processClick(transaction, uniqueId, campaignId, influencerId);
          //   logger.log("isUniqueClick : "+isUniqueClick);
          let markPromotionInactive = false;
          if (isUniqueClick === true) {
            decrementCampaignBalanceQuota = true;
            incrementUniqueClicks = true;
            const achievedUniqueClicks = influencerPromotionData.unique_clicks_received + 1;
            // logger.log("achievedUniqueClicks : "+achievedUniqueClicks);
            if (achievedUniqueClicks >= influencerPromotionData.reserved_clicks) {
              //   logger.log("Influencer Target achieved with in the time : ");
              influencerData = await getInfluencerUserData(transaction, influencerId);
              //   logger.log("influencerData : "+influencerData);
              if (influencerData != null) {
                if (achievedUniqueClicks >= influencerData.user_max_click_score) {
                  //   logger.log("increasing user level");
                  increaseUserLevel = true;
                  increaseScoreClick = Math.round(influencerData.user_max_click_score * 0.3);
                }
              }
              if (campaignData === null) {
                campaignData = await getCampaignData(transaction, campaignId);
              }
              //   logger.log("campaignData : "+campaignData);
              if (campaignData != null) {
                if (campaignData.unlocked_quota > 0) {
                  //   logger.log("Increasing target size : ");
                  newReserve = Math.min(influencerData.user_max_click_score + increaseScoreClick - achievedUniqueClicks, campaignData.balance_quota);
                  //   logger.log("New reserve : "+newReserve);
                } else {
                  markPromotionInactive = true;
                }
              }
            }
          }
          if (increaseUserLevel) {
            // logger.log("New score increase by : "+increaseScoreClick);
            transaction.update(firestore.collection("influencer_users").doc(influencerId), {
              "user_max_click_score": admin.firestore.FieldValue.increment(increaseScoreClick),
            });
          }
          if (decrementCampaignBalanceQuota === true || newReserve > 0) {
            const data = {};
            if (decrementCampaignBalanceQuota) {
              data["balance_quota"] = admin.firestore.FieldValue.increment(-1);
            }
            if (newReserve > 0) {
              data["unlocked_quota"] = admin.firestore.FieldValue.increment(-newReserve);
            }
            transaction.update(firestore.collection("campaigns").doc(campaignId), data);
          }
          if (incrementUniqueClicks === true || newReserve > 0 || markPromotionInactive === true) {
            const data = {};
            if (incrementUniqueClicks) {
              data["unique_clicks_received"] = admin.firestore.FieldValue.increment(1);
              data["last_updated"] = admin.firestore.FieldValue.serverTimestamp();
            }
            if (newReserve > 0) {
              data["reserved_clicks"] = admin.firestore.FieldValue.increment(newReserve);
            }
            if (markPromotionInactive === true) {
              data["status"] = "completed";
            }
            transaction.update(firestore.collection("influencer_promotions").doc(promotionId), data);
            if (incrementUniqueClicks) {
              transaction.set(firestore.collection("promotions_click_tracks").doc(), {
                "unique_id": uniqueId,
                "campaign_id": campaignId,
                "clicked_on": admin.firestore.FieldValue.serverTimestamp(),
                "from_influencer_id": influencerId,
              });
            }
          }
        } else {
          await ensurePromotionIsInactive(transaction, influencerPromotionData);
        }
      }).then(() => {
        logger.info("Link Click Recoreded");
      }).catch((err) => {
        logger.error("Business Link click failed due to " + err.toString());
      });
    }
  }
};


/**
 *
 * @param {object} transaction
 * @param {object} influencerPromotionData
 * @return {*}
 */
async function ensurePromotionIsInactive(transaction, influencerPromotionData) {
  if (influencerPromotionData.status != "completed") {
    transaction.update(firestore.collection("influencer_promotions").doc(influencerPromotionData.promotion_id), {
      "status": "completed",
    });
  }
}

/**
 *
 * @param {object} transaction - Firestore transaction
 * @param {object} uniqueId - uniqueid
 * @param {object} campaignId - campaignId
 * @param {object} fromInfId - from Influencer Id
 * @return {boolean} weather click is unique or not
 */
async function processClick(transaction, uniqueId, campaignId, fromInfId) {
  const snapshot = await transaction.get(firestore.collection("promotions_click_tracks").where("campaign_id", "==", campaignId).where("unique_id", "==", uniqueId).where("from_influencer_id", "==", fromInfId).limit(1));
  //   logger.log("getInfluencerPromotionData snapshot is "+snapshot.data());
  if (!snapshot.empty && snapshot.docs.length > 0) {
    return false;
  }
  return true;
}

/**
*
* @param {object} influencerPromotionData
* @return {boolean}
*/
function verifyPromotionStatus(influencerPromotionData) {
  if (influencerPromotionData.unique_clicks_received < influencerPromotionData.reserved_clicks) {
    return true;
  }
  return false;
}

/**
*
* @param {*} transaction - Firestore transaction
* @param {string} promotionId - Promotion Id
* @return {Map|null}
*/
async function getInfluencerPromotionData(transaction, promotionId) {
  const snapshot = await transaction.get(firestore.collection("influencer_promotions").doc(promotionId));
  //   logger.log("getInfluencerPromotionData snapshot is "+snapshot.data());
  if (snapshot.exists) {
    return snapshot.data();
  }
  return null;
}

/**
*
* @param {*} transaction - Firestore transaction
* @param {string} influencerId - Promotion Id
* @return {Map|null}
*/
async function getInfluencerUserData(transaction, influencerId) {
  const snapshot = await transaction.get(firestore.collection("influencer_users").doc(influencerId));
  if (snapshot.exists) {
    return snapshot.data();
  }
  return null;
}

/**
*
* @param {*} transaction - Firestore transaction
* @param {string} campaignId - Promotion Id
* @return {Map|null}
*/
async function getCampaignData(transaction, campaignId) {
  const snapshot = await transaction.get(firestore.collection("campaigns").doc(campaignId));
  if (snapshot.exists) {
    return snapshot.data();
  }
  return null;
}

/**
*
* @return {object|null}
*/
async function fetchAndSetRemoteConfig() {
  const config = admin.remoteConfig();
  try {
    return (await config.getTemplate()).parameters;
  } catch (e) {
    logger.error("Unable to fetch Remote Config data "+e);
    return null;
  }
  // logger.info("Fetched Remoted config data");
  // logger.info(template.parameters["ad_target_serviceable_locations"].defaultValue.value.toString());
}

/**
 *
 * @param {*} clientIP
 * @param {*} serviceLocations
 * @param {*} campaignData
 * @return {object}
 */
async function isClickFromLocationRange(clientIP, serviceLocations, campaignData) {
  const locationParts = campaignData.target_locations[0].split("-");
  const locationType = locationParts[locationParts.length - 1];

  const clientLocationData = await axios.get("https://ipinfo.io/"+clientIP+"/json?token=d96f9cd8658639");

  const clientLat = clientLocationData.data.loc.toString().split(",")[0];
  const clientLong = clientLocationData.data.loc.toString().split(",")[1];
  const region = clientLocationData.data.region.toLowerCase().replace(/ /g, "_");
  const country = clientLocationData.data.country.toLowerCase();

  if (locationType === "city") {
    const serviceCities = serviceLocations["cities"];
    for (const targetLocation of campaignData.target_locations) {
      if (serviceCities[targetLocation] != null) {
        const targetLat = serviceCities[targetLocation]["lat"];
        const taregtLong = serviceCities[targetLocation]["long"];
        const distance = calculateDistance(targetLat, taregtLong, clientLat, clientLong);
        console.log(distance);
        if (distance < 60) {
          return true;
        }
      }
    }
  } else {
    for (const targetLocation of campaignData.target_locations) {
      if (locationType === "state") {
        if (targetLocation.toLowerCase().includes("-"+country+"-") && targetLocation.toLowerCase().includes(region+"-")) {
          return true;
        }
      } else if (locationType === "country") {
        if (targetLocation.toLowerCase().includes(country+"-")) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 *
 * @param {*} lat1
 * @param {*} lon1
 * @param {*} lat2
 * @param {*} lon2
 * @return {object}
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}
