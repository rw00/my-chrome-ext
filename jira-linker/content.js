(function () {
  let jiraBaseUrl = "";

  // Load the Jira Base URL
  chrome.storage.sync.get({ jiraBaseUrl: "" }, (items) => {
    jiraBaseUrl = items.jiraBaseUrl;
    if (jiraBaseUrl) {
      init();
    }
  });

  const JIRA_REGEX = /\b([A-Z]+-\d+)\b/g;

  const SKIP_TAGS = new Set([
    "A",
    "CODE",
    "PRE",
    "SCRIPT",
    "STYLE",
    "TEXTAREA",
    "INPUT",
    "NOSCRIPT",
  ]);

  function init() {
    // Initial scan
    linkify(document.body);

    // Observe changes for dynamic content (GitHub/GitLab use PJAX/Turbo/SPAs)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            linkify(node);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function linkify(root) {
    if (!jiraBaseUrl) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        // Skip nodes that are already links or in code blocks
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        if (SKIP_TAGS.has(parent.tagName) || parent.closest("a, code, pre")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    let currentNode;

    while ((currentNode = walker.nextNode())) {
      if (JIRA_REGEX.test(currentNode.nodeValue)) {
        textNodes.push(currentNode);
      }
      JIRA_REGEX.lastIndex = 0; // Reset regex
    }

    textNodes.forEach((node) => {
      const content = node.nodeValue;
      const fragments = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = JIRA_REGEX.exec(content)) !== null) {
        // Text before the match
        if (match.index > lastIndex) {
          fragments.appendChild(
            document.createTextNode(content.slice(lastIndex, match.index)),
          );
        }

        // The Jira link
        const key = match[1];
        const jiraLink = document.createElement("a");
        jiraLink.href = `${jiraBaseUrl}/browse/${key}`;
        jiraLink.textContent = key;
        jiraLink.target = "_blank";
        jiraLink.rel = "noopener noreferrer";
        styleJiraLink(jiraLink);
        jiraLink.className = "jira-linker-link";

        // Add a subtle hover effect
        jiraLink.addEventListener(
          "mouseenter",
          () => (jiraLink.style.textDecoration = "underline"),
        );
        jiraLink.addEventListener(
          "mouseleave",
          () => (jiraLink.style.textDecoration = "none"),
        );

        fragments.appendChild(jiraLink);
        lastIndex = JIRA_REGEX.lastIndex;
      }

      // Remaining text after last match
      if (lastIndex < content.length) {
        fragments.appendChild(
          document.createTextNode(content.slice(lastIndex)),
        );
      }

      node.replaceWith(fragments);
    });
  }

  function styleJiraLink(jiraLink) {
    jiraLink.style.color = "#0052CC"; // Jira blue
    jiraLink.style.textDecoration = "none";
    jiraLink.style.fontWeight = "500";
  }
})();
