# Order Opener Automation Script

This Node.js script uses [Puppeteer](https://github.com/puppeteer/puppeteer) to automate opening order pages in a real browser. It prompts the user to enter order numbers repeatedly, then opens a new browser tab for each order URL. The browser closes automatically when the user exits.

## Features

- Prompts for order numbers one at a time
- Opens each order in a new Chrome tab
- Attempts to scrape and log the order status from the page
- Ends gracefully when user presses Enter on an empty input
- Closes browser automatically on exit

## Prerequisites

- Node.js (v14+ recommended)
- npm
- Windows, Linux, or macOS with a GUI environment (to open browser windows)
- Internet connection for Puppeteer installation and accessing order URLs

## Setup

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

## Running the script

To run the script use the command:

```bash
npm run start
```

Alternatively you can run the script directly through:

```bash
node order-check.js
```
