const puppeteer = require("puppeteer");
require("dotenv").config();

const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

let browser; // Singleton browser instance

const initializeBrowser = async (proxy) => {
  if (!browser) {
    // Parse and format proxy URL properly
    const proxyUrl = new URL(proxy);
    const formattedProxy = `${proxyUrl.hostname}:${proxyUrl.port}`;

    browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${formattedProxy}`,
        '--ignore-certificate-errors',
        '--no-sandbox'
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      ignoreHTTPSErrors: true,
      userDataDir: '/mnt/data/puppeteer_cache'
    });
    console.log('Browser initialized');
  }
  console.log('Browser initialized2');
  return browser;
};

const go = async (res, url, user,pass, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Authenticate proxy BEFORE setting request interception
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });

 
    

    console.log('Page loaded2');
    await page.goto(url);
      console.log(url);

    console.log('Page loaded');

    // Rest of your code remains exactly the same...
    try {
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('button, a'))
          .some(el => el.textContent.trim() === 'Accept all'),
        { timeout: 5000 } // Adjust timeout as needed
      );
      await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button, a'))
          .find(el => el.textContent.trim() === 'Accept all');
        if (button) {
          button.click();
        }
      });
      console.log('"Accept all" button clicked');
    } catch (e) {
      console.log('"Accept all" button not found, continuing');
    }

  
    await page.keyboard.press('Escape');
     
   
    await page.waitForSelector('#username');
    // Type into the input field
       console.log('usename found');
    await page.type('#username', 'fasbsaty643');
    console.log('username type!');

     await page.waitForSelector('#password');
    // Type into the input field
    await page.type('#password', 'Gcwtkycs1997#');
    console.log('password type!');
    await page.click('#sso-forms__submit');
    console.log('clicked  login!');
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await delay(3000); // Wait for 400ms before clicking

      const screenshotBuffer = await page.screenshot({ fullPage: true });

  // Convert the screenshot Buffer to a Base64 string
  const base64Screenshot = screenshotBuffer.toString('base64');

  // Print the Base64 string
  console.log(base64Screenshot);
    console.log('Task completed successfully');
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running : ${e}`);
  } finally {
    // Optionally close the browser if needed, but keeping it open for speed
    // await browser.close();
  }
};

module.exports = { go };
