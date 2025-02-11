function waitForElm(selector) {
    return new Promise(resolve => {
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return resolve(element);
            }
            return false;
        };

        if (checkElement()) {
            return;
        }

        const observer = new MutationObserver(mutations => {
            if (checkElement()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function handleUrlChange() {
    waitForElm("#content > div.ItemPage > div.ItemPage-column.ItemPage-column--right > div > div > div.ItemPage-price > div.ItemPage-value > div")
        .then((elm) => {
            const updateContent = () => {
                let value = parseFloat(elm.textContent.replace(/[^0-9.-]+/g, ""));
                let formattedValue = (value * (value >= 1000 ? 1.06 : 1.12)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                let suggestedDiv = document.querySelector("#content > div.ItemPage > div.ItemPage-column.ItemPage-column--right > div > div > div.ItemPage-suggested");

                if (suggestedDiv) {
                    if (!document.getElementById('fee-info')) {
                        let newDiv = document.createElement('div');
                        newDiv.id = 'fee-info';
                        newDiv.innerHTML = `<span>Price + Seller Fees: $${formattedValue}</span>`;
                        newDiv.style.fontSize = "24px"

                        suggestedDiv.parentNode.insertBefore(newDiv, suggestedDiv);
                    } else {
                        let existingDiv = document.getElementById('fee-info');
                        existingDiv.innerHTML = `<span>Price + Seller Fees: $${formattedValue}</span>`;
                        existingDiv.style.fontSize = "24px"
                    }
                }
            };

            updateContent();

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        updateContent();
                    }
                });
            });

            observer.observe(elm, { childList: true, characterData: true, subtree: true });
        });
}

handleUrlChange();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'url_changed') {
        handleUrlChange();
    }
});

// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
//     if (details.url.includes('https://skinport.com/item/')) {
//         chrome.scripting.executeScript({
//             target: { tabId: details.tabId },
//             files: ['scripts/content.js']
//         });
//     }
// });