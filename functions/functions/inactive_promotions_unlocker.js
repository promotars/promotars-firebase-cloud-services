const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const firestore = admin.firestore();

module.exports = async () => {
  logger.info("Auto Promotions Unlocker started");
  const remotConfig = await fetchAndSetRemoteConfig();
  if (remotConfig != null) {
    logger.info(remotConfig["ad_target_serviceable_locations"].defaultValue.value.toString());
  }
  await firestore.runTransaction(async (transaction)=>{
    const currTime = admin.firestore.Timestamp.now().toDate();
    const time24hrsAgo = new Date(currTime.getTime() - 24 * 60 * 60 * 1000);
    // logger.info("24 hrs ago time : "+time24hrsAgo);
    const docsSnapshot = await transaction.get(firestore.collection("influencer_promotions").where("last_updated", "<", admin.firestore.Timestamp.fromDate(time24hrsAgo)).where("status", "==", "active"));
    if (!docsSnapshot.empty && docsSnapshot.docs.length > 0) {
    //   logger.info("docs len : "+docsSnapshot.docs.length);
      await docsSnapshot.docs.forEach(async (doc) => {
        await makePromotionInActive(transaction, doc.data());
      });
    }
  }).then(()=>{
    logger.log("Inactive Promotions Unlocker is successful");
  }).catch((err)=>{
    logger.error("Inactive Promotions Unlocker failed due to "+err.toString());
  });
};

/**
 *
 * @param {object} transaction
 * @param {object} influencerPromotionData
 * @return {*}
 */
async function makePromotionInActive(transaction, influencerPromotionData) {
  const unlockableClicks = influencerPromotionData.reserved_clicks - influencerPromotionData.unique_clicks_received;
  if (influencerPromotionData.status != "completed") {
    // logger.info("Updating influencer_promotions");
    transaction.update(firestore.collection("influencer_promotions").doc(influencerPromotionData.promotion_id), {
      "status": "completed",
      "reserved_clicks": influencerPromotionData.unique_clicks_received,
    });
  }
  if (unlockableClicks > 0) {
    // logger.info("Updating campaigns");
    transaction.update(firestore.collection("campaigns").doc(influencerPromotionData.campaign_id), {
      "unlocked_quota": admin.firestore.FieldValue.increment(unlockableClicks),
    });
  }
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
