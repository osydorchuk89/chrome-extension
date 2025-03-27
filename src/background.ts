chrome.runtime.onInstalled.addListener(() => {
    // Inject content script into all currently open tabs
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
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
