import "./vendor/inline-module-4dd886cc2b6808124f5e11e045eec6b7.js";

const obj = document.createElement('app-schmackhaft');

function handleClick() {
    console.log(obj.links);
}

function handleMessage(request, sender, sendResponse) {
    if (request.method === "getElement") {
        sendResponse({element: obj.links})
    } else {
        console.error(`Unknown request: ${request.method}`)
    }
}

browser.pageAction.onClicked.addListener(handleClick);
browser.runtime.onMessage.addListener(handleMessage);
