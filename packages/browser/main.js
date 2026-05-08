if (typeof browser === "undefined") {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}

browser.action.onClicked.addListener((tab) => {
  console.log("hello world");
  if (!tab.id) {
    return;
  }

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: ["copy.js"],
    })
    .catch((error) => {
      console.error("Failed to inject copy script:", error);
    });
});
