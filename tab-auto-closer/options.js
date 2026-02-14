const rulesListItems = document.getElementById("rulesListItems");
const urlInput = document.getElementById("url");
const matchTextInput = document.getElementById("matchText");
const addRuleBtn = document.getElementById("addRule");

// Load rules on startup
document.addEventListener("DOMContentLoaded", loadRules);

addRuleBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  const matchText = matchTextInput.value.trim();

  if (!url || !matchText) {
    return;
  }

  chrome.storage.sync.get({ rules: [] }, (data) => {
    const isDuplicate = data.rules.some(
      (r) => r.url === url && r.matchText === matchText,
    );
    if (isDuplicate) {
      return;
    }

    const newRule = {
      id: Date.now().toString(),
      url,
      matchText,
    };

    const rules = [...data.rules, newRule];
    chrome.storage.sync.set({ rules }, () => {
      renderRules(rules);
      urlInput.value = "";
      matchTextInput.value = "";
    });
  });
});

function loadRules() {
  chrome.storage.sync.get({ rules: [] }, (data) => {
    renderRules(data.rules);
  });
}

function renderRules(rules) {
  if (rules.length === 0) {
    rulesListItems.innerHTML =
      '<div class="empty-state">No rules configured yet.</div>';
    return;
  }

  rulesListItems.innerHTML = "";
  rules.forEach((rule) => {
    const item = document.createElement("div");
    item.className = "rule-item animate-in";
    item.innerHTML = `
      <div class="rule-content">
        <div class="rule-title">${escapeHtml(rule.url)}</div>
        <div class="rule-subtitle">Matches text: "${escapeHtml(rule.matchText)}"</div>
      </div>
      <button class="danger delete-btn" data-id="${rule.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
      </button>
    `;
    rulesListItems.appendChild(item);
  });

  // Add delete-btn listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      deleteRule(id);
    });
  });
}

function deleteRule(id) {
  chrome.storage.sync.get({ rules: [] }, (data) => {
    const rules = data.rules.filter((r) => r.id !== id);
    chrome.storage.sync.set({ rules }, () => {
      renderRules(rules);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
