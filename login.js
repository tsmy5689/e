const puppeteer = require("puppeteer");
require("dotenv").config();

// Scrape.do credentials
const proxyUsername = '4503876c67074004a27dfc88477f560437b740fea99';
const proxyPassword = 'render=false';
const proxyAddress = 'proxy.scrape.do:8080';

let browser; // Singleton browser instance

const initializeBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=http://${proxyAddress}`,
        '--ignore-certificate-errors',
        '--no-sandbox'
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      ignoreHTTPSErrors: true,
      userDataDir: '/mnt/data/envato11111'
    });
    console.log('Browser initialized');
  }
  return browser;
};

const go = async (res, url, user, pass) => {
  const blockedResourceTypes = [
    'beacon',
    'csp_report',
    'font',
    'image',
    'imageset',
    'media',
    'object',
    'texttrack',
    'stylesheet',
  ];

  try {
    const browser = await initializeBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Set up request interception to block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (blockedResourceTypes.includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Authenticate with scrape.do proxy
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });

    console.log('Navigating to URL:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    console.log('Page loaded');

    // Handle "Accept all" cookies button if it exists
    try {
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('button, a'))
          .some(el => el.textContent.trim() === 'Accept all'),
        { timeout: 5000 }
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
     
    // Fill in login form
    await page.waitForSelector('#username', { timeout: 10000 });
    console.log('Username field found');
    await page.type('#username', user || 'fsdg6342@proton.me');
    console.log('Username typed');

    await page.waitForSelector('#password', { timeout: 10000 });
    await page.type('#password', pass || 'Gcwtkycs1997#');
    console.log('Password typed');
 
    // Add some delays between actions
    await page.waitForTimeout(2000);
    console.log('Wait 1 complete');
    
    await page.waitForTimeout(2000);
    console.log('Wait 2 complete');

    // Click login button
    await page.click('#sso-forms__submit');
    console.log('Clicked login button');
    await page.waitForTimeout(2000);

    // Take screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 30,
      fullPage: true
    });

    const base64Screenshot = screenshotBuffer.toString('base64');
    console.log('Screenshot taken');

    console.log('Task completed successfully');
    return base64Screenshot;
  } catch (e) {
    console.error('Error in go function:', e);
    if (res) {
      res.send(`Something went wrong while running: ${e.message}`);
    }
    throw e;
  } finally {
    // Note: We're not closing the browser to maintain the singleton instance
  }
};

module.exports = { go };
