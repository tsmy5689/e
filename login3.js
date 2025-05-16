const puppeteer = require("puppeteer-core"); // Changed to puppeteer-core
require("dotenv").config();

// Proxy and authentication details
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

// Browserless.io connection details
const browserlessToken = '2SJiFPoA1LWJf1efdb4c24535106e69a00f371f46e6ed5015'; // Use from .env file or fallback
const browserlessEndpoint = `wss://production-sfo.browserless.io?token=${browserlessToken}&proxy=residential`;

// Singleton browser instance
let browser;

// Initialize browser by connecting to browserless.io instead of launching locally
const initializeBrowser = async () => {
  if (!browser) {
    try {
      browser = await puppeteer.connect({
        browserWSEndpoint: browserlessEndpoint,
      });
      console.log('Connected to remote browser service');
    } catch (error) {
      console.error('Failed to connect to remote browser:', error);
      throw error;
    }
  }
  return browser;
};

const go3 = async (res, url, user, pass, proxy) => {
  try {
    // Connect to remote browser instead of launching
    const browser = await initializeBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Authenticate proxy
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });
    
    console.log('Navigating to URL:', url);
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('Page loaded');
    
    // Handle "Accept all" button if present
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
    await page.keyboard.press('Escape');

     const screenshotBuffer2 = await page.screenshot({
      type: 'jpeg',
      quality: 30,
      fullPage: true
    });
    
    // Convert screenshot to Base64
    const base64Screenshot2 = screenshotBuffer2.toString('base64');
    console.log(base64Screenshot2);
    
    // Login process
    await page.waitForSelector('#username');
    console.log('Username field found');
    await page.type('#username', 'xyhwkb826');
    console.log('Username entered');
    
    await page.waitForSelector('#password');
    await page.type('#password', 'gcwtkycs1997#');
    console.log('Password entered');
 
    await page.waitForTimeout(2000);
    

    await page.click('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    console.log('accept c button clicked');
    
    // Click login button
    await page.click('#sso-forms__submit');
    console.log('Login button clicked');
    
    
    await page.waitForTimeout(8000);
    
    // Take screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 30,
      fullPage: true
    });
    
    // Convert screenshot to Base64
    const base64Screenshot = screenshotBuffer.toString('base64');
    console.log(base64Screenshot); // Log just the beginning for brevity
    
    console.log('Task completed successfully');
    
    // You can add any additional functionality from your original script here
    
    // Return or respond with appropriate data
    if (res && typeof res.send === 'function') {
      res.send('Task completed successfully');
    }
    
  } catch (e) {
    console.error('Error in go3 function:', e);
    if (res && typeof res.send === 'function') {
      res.send(`Something went wrong while running: ${e}`);
    }
  }
  // Note: We don't close the browser to keep the connection open for reuse
};

// Optional function to explicitly close the browser when needed
const closeBrowser = async () => {
  if (browser) {
    await browser.close();
    browser = null;
    console.log('Browser connection closed');
  }
};

module.exports = { go3, closeBrowser };
