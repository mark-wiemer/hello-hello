chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) {
    return;
  }

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: ["main.js"],
    })
    .catch((error) => {
      console.error("Failed to inject copy script:", error);
    });
});
