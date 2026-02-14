chrome.runtime.onMessage.addListener((request, sender, _sendResponse) => {
  if (request.action === "close_tab" && sender.tab) {
    const tabId = sender.tab.id;

    chrome.tabs.remove(tabId, () => {
      if (chrome.runtime.lastError) {
        return;
      }

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "TabAutoCloser",
        message: "A tab was automatically closed based on your rules.",
        priority: 0,
      });
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("TabAutoCloser extension installed and active.");
});
