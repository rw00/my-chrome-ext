// Saves options to chrome.storage
function saveOptions() {
  const jiraUrl = document
    .getElementById("jiraUrl")
    .value.trim()
    .replace(/\/$/, "");

  if (!jiraUrl) {
    showStatus("Please enter a valid URL", false);
    return;
  }

  chrome.storage.sync.set({ jiraBaseUrl: jiraUrl }, () => {
    showStatus("Settings saved successfully!", true);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get({ jiraBaseUrl: "" }, (items) => {
    document.getElementById("jiraUrl").value = items.jiraBaseUrl;
  });
}

function showStatus(message, isSuccess) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = isSuccess ? "success show" : "show";

  setTimeout(() => {
    status.className = "";
  }, 2000);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
