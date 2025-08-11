import { createAvery48160Labels } from "./label-creation.js";
import puppeteer from "puppeteer";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // visible browser
    defaultViewport: null,
  });

  const orderNumbers = [];
  while (true) {
    const input = await askQuestion("Enter order number (empty to finish): ");
    if (!input.trim()) break;
    orderNumbers.push(input.trim());
  }
  rl.close();

  const results = [];

  for (const orderNumber of orderNumbers) {
    const page = await browser.newPage();
    await page.goto(`http:localhost:3000/order`, {
      waitUntil: "domcontentloaded",
    });

    // Scrape data without closing the tab
    const shippingOption = await page.$eval(".underlinelabel", (el) =>
      el.textContent.trim()
    );
    let shippingAddress = await page.$eval(".innerinfo", (el) =>
      el.innerHTML.trim()
    );

    // Remove the ending breaks
    shippingAddress.replaceAll("</br>", "");

    let shipAddArr = shippingAddress.split("<br>");

    if (shippingOption === "Shipping - Pick Up at Studio") {
      // Then we need to adjust the label to ** Pick up at Studio **
      shipAddArr[1] = "** Pick Up at Studio **";
      shipAddArr[2] = "";
    }

    results.push({
      name: shipAddArr[0],
      address: shipAddArr[1],
      location: shipAddArr[2],
      orderNumber,
      data: shippingAddress,
    });
  }

  console.log("Scraped results:", results);
  await createAvery48160Labels(results);
  console.log("Finished generating labels.");
  console.log(
    "In the terminal press Control + C to exit the script and close the browsers"
  );
})();
