# TabAutoCloser

TabAutoCloser is a Chrome extension designed to save you those precious seconds by automatically closing tabs that are no longer needed, such as "Login Successful" or "Authorization Complete" pages.

## Features

- **Automated Workflow**: Instantly closes tabs based on custom URL and text patterns.
- **Privacy Focused**: Runs entirely locally. No data collection and no logging.
- **Performant**: Uses MutationObservers to handle dynamic content without slowing down your browser.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `tab-auto-closer` directory.

## Configuration

1. Click the extension icon and select **Configure Rules**.
2. Add a **URL** (e.g., `https://accounts.google.com/o/oauth2/auth/success`).
3. Add the **Match Text** you expect to see on the page (e.g., `You are now signed in`).
4. Click **Add Rule**.

Now, whenever you land on a page that matches
both the URL and contains that specific text,
the tab will close itself automatically.
