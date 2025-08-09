const puppeteer = require("puppeteer");
const readline = require("readline");

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 50,
  });

  while (true) {
    const orderNumber = await askQuestion(
      "Enter order number (or press Enter to quit): "
    );
    if (!orderNumber) {
      console.log("No input detected. Exiting...");
      break;
    }

    const page = await browser.newPage();
    const url = `https://example.com/orders/${orderNumber}`;
    console.log(`Opening new tab for order: ${orderNumber}`);
    await page.goto(url, { waitUntil: "networkidle2" });

    try {
      const statusText = await page.$eval(".order-status", (el) =>
        el.textContent.trim()
      );
      console.log(`Order ${orderNumber} status: ${statusText}`);
    } catch {
      console.log(`Order ${orderNumber}: Could not find status element.`);
    }
  }

  //   console.log("Done. Browser will stay open with all tabs.");
  await browser.close(); // Comment if you want to leave browser open with all tabs
  console.log("Browser closed. Goodbye!");

  // Force exit Node process cleanly
  process.exit(0);
})();
