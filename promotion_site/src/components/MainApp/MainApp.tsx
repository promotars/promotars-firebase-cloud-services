import { useEffect, useState } from "react";
import { db } from "../../services/firebase/firebase_config";
import { doc, getDoc } from "firebase/firestore";
import Utils from "../../utils/utils";
import callBusinessClickFunction from "../../services/firebase/cloud_functions";
import useRecaptchaV3 from "../hooks/RecaptchaV3";


function MainApp() {
    const [isLoading, setLoading] = useState(false);
    const [campaignData, setCampaignData] = useState(new Map())

    let isInit = false;

    const executeRecaptcha = useRecaptchaV3('6LcT17gpAAAAAIW9S8yzfH3Rf7OGN9diyxzpQ6wn') // Prod Mode

    useEffect(() => {
        const getCampaignsData = async () => {
            if (isInit) {
                return;
            }
            isInit = true;
            if (Object.keys(campaignData).length != 0 && isLoading) {
                return
            }
            setLoading(true)
            const campaignId = validateAndGetCampaignId();
            if (campaignId != null) {
                try {
                    const docRef = doc(db, "campaigns", campaignId);
                    const data = await getDoc(docRef);
                    if (data.exists()) {
                        // console.log(data.data());
                        setCampaignData(objectToMap(data.data()))
                    } else {
                        // console.log("No data");
                    }
                } catch (e) {
                    // console.log("Error In getCampaignData E - " + e);
                }
            }
            setLoading(false)
        }
        getCampaignsData()
    }, [])

    return <>
        <nav className="navbar" style={{ backgroundColor: '#0169ff', color: 'white', textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
            <div className="navbar-logo" style={{ textAlign: 'center', width: '100%' }}>
                <h1 className="bold-font" style={{ margin: '0', fontSize: 22 }}>Promotars</h1>
            </div>
        </nav>
        <div style={{ height: 20 }}></div>
        {isLoading ? <center><div className="spinner-border col" role="status">
            <span className="sr-only col"></span>
        </div></center> : <div className="container text-center">
            <div className="col">
                <h1 className="bold-font" style={{ fontSize: 20 }}>{truncateString(campaignData.get("caption"), 80)}</h1>
                <div style={{ height: 20 }}></div>
                <div style={{ borderRadius: '10px', marginLeft: 32, marginRight: 32, overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <img src={campaignData.get("media_uri")} alt="Image" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                </div>
            </div>
        </div>}
        <div style={{ height: 20 }}></div>
        <center><button type="button" className="btn" onClick={ctaClick} style={{ backgroundColor: '#0169ff', color: "white" }}>Continue</button></center>
    </>

    async function ctaClick() {
        const recaptchKey = await executeRecaptcha("ad_click");
        const promotionId = validateAndGetPromotionId();
        if (recaptchKey != null && recaptchKey.length > 0 && promotionId != null && promotionId.length > 0) {
            // console.log(recaptchKey);
            let uid = Utils.getUniqueID()
            callBusinessClickFunction({
                "unique_id": uid,
                "promotion_id": validateAndGetPromotionId(),
                "recaptcha_key": recaptchKey
            })
            window.location.href = campaignData.get("landing_uri")
        }
    }
}

function validateAndGetCampaignId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const campaignId = urlParams.get('campaign_id') || "";
    if (campaignId.length === 0) {
        // console.log("Campaign Id is empty");
        return null;
    }
    return campaignId;
}

function validateAndGetPromotionId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const campaignId = urlParams.get('promotion_id') || "";
    if (campaignId.length === 0) {
        // console.log("Promotion Id is empty");
        return null;
    }
    return campaignId;
}

function objectToMap(obj: {}): Map<string, any> {
    const map = new Map<string, any>();

    // Iterate over the object's entries and add them to the map
    for (const [key, value] of Object.entries(obj)) {
        map.set(key, value);
    }

    return map;
}

function truncateString(str: string, maxLength: number): string {
    try {
        if (str.length <= maxLength) {
            return str;
        } else {
            return str.substring(0, maxLength) + '...';
        }
    } catch (_) {
        return str;
    }
}
export default MainApp