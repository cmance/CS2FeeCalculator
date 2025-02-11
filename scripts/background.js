chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if (details.url.includes('https://skinport.com/item/')) {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['scripts/content.js']
        });
    }
});