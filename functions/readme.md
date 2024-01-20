Fetch Remote config configurations
Fetch influencer_promotions/promotion_id (READ)
Check if click is unique
if click == unique
   Fetch campaigns/campaignId
   if (campaign.balance_quota > 0 & campaign.is_active = true) // We can have this fetch & check at FE end
   if influencer due date != completed
     decrement balance_quota in campaigns (WRITE)
     increment total_clicks_received, unique_clicks_received in influencer_promotions (WRITE)
 else
   increment total_clicks_received in influencer_promotions (WRITE)

if click == unique
   if (unique_clicks_received+1) >= reserved_clicks
      increment user_max_score_clicks in influencers_users (WRITE)
      Fetch campaigns/campaignId (READ)
      if campaigns unlocked_quota > 0
         Fetch influencers_users/influencerId (READ)
         newReserve = min(influencers_users.user_max_score_clicks, campaigns.balance_quota)
         increment reserved_clicks += newReserve & update promotion_due_date in influencer_promotions (WRITE)
         decrement unlocked_quota -= newReserve in campaigns (WRITE)

