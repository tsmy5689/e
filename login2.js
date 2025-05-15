const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();

// Add the stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';
let browser; // Singleton browser instance

// List of user agents for variety
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
];

// Common screen resolutions
const screenResolutions = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 2560, height: 1440 },
  { width: 1280, height: 720 }
];

// Helper functions
const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];
const getRandomResolution = () => screenResolutions[Math.floor(Math.random() * screenResolutions.length)];
const getRandomDelay = (min = 100, max = 500) => Math.floor(Math.random() * (max - min + 1)) + min;

const initializeBrowser = async (proxy) => {
  if (!browser) {
    // Parse and format proxy URL properly
    const proxyUrl = new URL(proxy);
    const formattedProxy = `${proxyUrl.hostname}:${proxyUrl.port}`;
    
    const resolution = getRandomResolution();
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${formattedProxy}`,
        `--window-size=${resolution.width},${resolution.height}`,
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-site-isolation-trials',
        '--disable-web-security'
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      ignoreHTTPSErrors: true,
      userDataDir: '/mnt/data/ev2'
    });
    console.log('Browser initialized with stealth plugin');
  }
  return browser;
};

const go2 = async (res, url, user, pass, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const page = await browser.newPage();
    
    const resolution = getRandomResolution();
    
    // Set viewport
    await page.setViewport({ 
      width: resolution.width, 
      height: resolution.height,
      deviceScaleFactor: Math.random() > 0.5 ? 1 : 2,
      hasTouch: Math.random() > 0.9,
      isLandscape: true,
      isMobile: false
    });
    
    // Set user agent - stealth plugin will enhance this further
    const userAgent = getRandomUserAgent();
    await page.setUserAgent(userAgent);
    
    // Set common HTTP headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"'
    });
    
    // Authenticate proxy
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });
    
    console.log('Navigating to page...');
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    console.log(`Page loaded: ${url}`);
    
    // Handle cookies popup
    try {
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('button, a'))
          .some(el => el.textContent.trim() === 'Accept all'),
        { timeout: 5000 }
      );
      
      // Add a small random delay before clicking
      await page.waitForTimeout(getRandomDelay(500, 1500));
      
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
  
    // Press Escape after a delay
    await page.waitForTimeout(getRandomDelay(800, 1500));
    await page.keyboard.press('Escape');
    
    // Handle login form
    await page.waitForSelector('#username');
    console.log('Username field found');
    
    await typeHumanLike(page, '#username', 'fsdg6342');
    console.log('Username entered');
    
    await page.waitForTimeout(getRandomDelay(300, 800));
    
    await page.waitForSelector('#password');
    await typeHumanLike(page, '#password', 'Gcwtkycs1997#');
    console.log('Password entered');
    
    await page.waitForTimeout(getRandomDelay(800, 1500));
    
    // Click login button
    const submitButton = await page.$('#sso-forms__submit');
    const buttonBox = await submitButton.boundingBox();
    
    await page.mouse.move(
      buttonBox.x + buttonBox.width * Math.random(),
      buttonBox.y + buttonBox.height * Math.random(),
      { steps: 10 }
    );
    
    await page.waitForTimeout(getRandomDelay(100, 300));
    await page.click('#sso-forms__submit');
    console.log('Login button clicked');
    
    // Wait for navigation after login
    await page.waitForTimeout(5000);
    
    // Take screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 30,
      fullPage: true
    });
    
    // Convert screenshot to Base64
    const base64Screenshot = screenshotBuffer.toString('base64');
    console.log(base64Screenshot);
    console.log('Task completed successfully');
  } catch (e) {
    console.error(e);
    if (res && res.send) {
      res.send(`Something went wrong while running: ${e}`);
    }
  } finally {
    // Pages are kept open for reuse
  }
};

// Function to type like a human
async function typeHumanLike(page, selector, text) {
  const element = await page.$(selector);
  await element.click({ clickCount: 3 }); // Select all existing text
  await page.waitForTimeout(getRandomDelay(100, 300));
  
  // Type each character with variable delay
  for (const char of text) {
    await page.type(selector, char, { delay: getRandomDelay(30, 150) });
  }
}

module.exports = { go2 };
