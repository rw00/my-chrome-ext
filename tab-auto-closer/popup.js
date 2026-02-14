document.addEventListener("DOMContentLoaded", () => {
  const ruleCountEl = document.getElementById("ruleCount");
  const openOptionsBtn = document.getElementById("openOptions");

  // Load rule count
  chrome.storage.sync.get({ rules: [] }, (data) => {
    const count = data.rules.length;
    ruleCountEl.textContent = `${count} active rule${count === 1 ? "" : "s"} configured`;
  });

  openOptionsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});
