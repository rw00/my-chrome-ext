let cachedRules = [];
let isClosing = false;
let checkTimeout;

function loadRules() {
  chrome.storage.sync.get({ rules: [] }, (data) => {
    cachedRules = data.rules;
    checkRules();
  });
}

// Listen for storage changes to keep cached rules up to date
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.rules) {
    cachedRules = changes.rules.newValue || [];
    checkRules();
  }
});

function checkRules() {
  if (isClosing || cachedRules.length === 0) return;

  const currentUrl = globalThis.location.href;

  for (const rule of cachedRules) {
    if (currentUrl.includes(rule.url)) {
      if (document.body?.innerText?.includes(rule.matchText)) {
        isClosing = true;
        // Request background script to close this tab
        chrome.runtime.sendMessage({ action: "close_tab" });
        break;
      }
    }
  }
}

// Check on load
if (document.readyState === "complete") {
  loadRules();
} else {
  globalThis.addEventListener("load", loadRules);
}

// Also observe DOM changes in case the message appears dynamically (AJAX/SPA)
let observer;
function startObserver() {
  if (observer) observer.disconnect();

  observer = new MutationObserver((_mutations) => {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkRules, 300);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

// Start observing after a small delay to let the initial load settle
setTimeout(() => {
  if (document.body) {
    startObserver();
  }
}, 100);
