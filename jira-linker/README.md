# Jira Linker Chrome Extension

This extension automatically detects Jira ticket keys (e.g., `CASH-2468`, `PROJ-123`) on GitHub and GitLab
and turns them into clickable links to your Jira instance.

## Features

- **Configurable Jira URL**: Set your own Jira base URL in the options page.
- **Live Updates**: Works with dynamically loaded content on GitHub and GitLab.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `jira-linker` folder in this project.

## Configuration

1. Once installed, click the extension icon
   (or find it in the extensions menu).
2. Click **Options** (or right-click the extension icon and select "Options").
3. Enter your Jira app base URL (e.g., `https://your-company.atlassian.net`).
4. Click **Save Configuration**.
5. Refresh any GitHub or GitLab page to see the links.
