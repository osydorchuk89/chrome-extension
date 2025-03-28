chrome.runtime.onInstalled.addListener(() => {
    // inject content script into all currently open tabs
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            // prevent running the content script on Chrome internal pages
            if (tab.url?.startsWith("chrome://")) return;
            if (tab.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"],
                });
            }
        });
    });
});
