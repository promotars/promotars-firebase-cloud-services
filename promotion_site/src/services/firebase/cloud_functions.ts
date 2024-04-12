import { getFunctions, httpsCallable } from "firebase/functions";

async function callBusinessClickFunction(params: {}) {
    const businessLinkClickCall = httpsCallable(getFunctions(), 'businessLinkClick');
    try {
        await businessLinkClickCall(params);
    } catch (error) {
        // console.log("error in CF call - " + error);
    };
}

export default callBusinessClickFunction