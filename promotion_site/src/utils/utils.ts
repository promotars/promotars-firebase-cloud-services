import md5 from "md5";

class Utils{
    static getUniqueID():string {
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
          viewportWidth.toString(),
          viewportHeight.toString(),
          // screenWidth,
          // screenHeight,
          devicePixelRatio.toString(),
          userLanguage,
          maxTouchPoints.toString()
        );
      
        return md5(id);
      }
}

export default Utils;