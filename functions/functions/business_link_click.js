const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const firestore = admin.firestore();

module.exports = async (request) => {
  const promotionId = request.data.promotion_id;
  //   logger.log("Promotion Id : "+promotionId);
  const remotConfig = await fetchAndSetRemoteConfig();
  logger.info(remotConfig["ad_target_serviceable_locations"].defaultValue.value.toString());

  await firestore.runTransaction(async (transaction)=>{
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

    const isPromotionActive = verifyPromotionStatus(influencerPromotionData);
    // logger.log("isPromotionActive : "+isPromotionActive);
    if (isPromotionActive) {
      const isUniqueClick = processClick(transaction);
      //   logger.log("isUniqueClick : "+isUniqueClick);
      if (isUniqueClick === true) {
        decrementCampaignBalanceQuota = true;
        incrementUniqueClicks = true;
        const achievedUniqueClicks = influencerPromotionData.unique_clicks_received+1;
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
          const campaignData = await getCampaignData(transaction, campaignId);
          //   logger.log("campaignData : "+campaignData);
          if (campaignData != null) {
            if (campaignData.unlocked_quota > 0) {
            //   logger.log("Increasing target size : ");
              newReserve = Math.min(influencerData.user_max_click_score+increaseScoreClick-achievedUniqueClicks, campaignData.balance_quota);
            //   logger.log("New reserve : "+newReserve);
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
      if (incrementUniqueClicks === true || newReserve > 0) {
        const data = {};
        if (incrementUniqueClicks) {
          data["unique_clicks_received"] = admin.firestore.FieldValue.increment(1);
        }
        if (newReserve > 0) {
          data["reserved_clicks"] = admin.firestore.FieldValue.increment(newReserve);
        }
        transaction.update(firestore.collection("influencer_promotions").doc(promotionId), data);
      }
    }
  }).then(()=>{
    logger.info("Transaction is Successful!");
  }).catch((err)=>{
    logger.error("Transaction failed due to "+err.toString());
  });
};

/**
 *
 * @param {object} transaction - Firestore transaction
 * @return {boolean} weather click is unique or not
 */
function processClick(transaction) {
  // TODO : Click verification
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
