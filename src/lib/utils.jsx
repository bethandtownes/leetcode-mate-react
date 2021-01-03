
import { DEBUG } from "./debug.js";

export function injectJSListener() {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('page_script.js');
    // console.log(s.src);
    (document.head || document.documentElement).appendChild(s);
    DEBUG("[status] pagescript injected");
}



export function make_slug(s) {
    return s.trim().toLowerCase().replace(/ /g, '-');
}

// export {injectJSListener};
