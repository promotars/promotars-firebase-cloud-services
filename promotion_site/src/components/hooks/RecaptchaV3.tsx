import { useState, useEffect, useCallback } from "react";

function useRecaptchaV3(siteKey: string) {
    const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

    useEffect(() => {
        if (window.grecaptcha) {
            setIsRecaptchaReady(true);
        } else {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
            script.async = true;
            document.head.appendChild(script);
            script.onload = () => setIsRecaptchaReady(true);
        }
    }, [siteKey]);

    const executeRecaptcha = useCallback(async (action: any) => {
        if (isRecaptchaReady && window.grecaptcha) {
            return await window.grecaptcha.execute(siteKey, { action });
        }
        return null;
    }, [isRecaptchaReady, siteKey]);

    return executeRecaptcha;
};

export default useRecaptchaV3;