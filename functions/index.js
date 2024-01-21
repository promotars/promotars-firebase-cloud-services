/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();

exports.businessLinkClick = onCall(async (request) => {
  return await require("./functions/business_link_click.js")(request);
});

exports.inactivePromotionsUnlocker = onSchedule("every day 00:00", async (event) => {
  return await require("./functions/inactive_promotions_unlocker.js");
});
