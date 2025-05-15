const puppeteer = require("puppeteer");
require("dotenv").config();
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';
let browser; // Singleton browser instance

// Common user agents for realistic browsing
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'
];

// Get random user agent to make each session appear different
const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Get random delay to simulate human interaction
const getRandomDelay = (min = 100, max = 500) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const initializeBrowser = async (proxy) => {
  if (!browser) {
    // Parse and format proxy URL properly
    const proxyUrl = new URL(proxy);
    const formattedProxy = `${proxyUrl.hostname}:${proxyUrl.port}`;
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${formattedProxy}`,
       
   
        `--window-size=1920,1080`,
       
     
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      ignoreHTTPSErrors: true,
      userDataDir: '/mnt/data/envato2222222two2'
    });
    console.log('Browser initialized');
  }
  return browser;
};

const go2 = async (res, url, user, pass, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const page = await browser.newPage();
    
    // Configure the page for more realistic browsing
    await page.setViewport({ 
      width: 1920, 
      height: 1080,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: true,
      isMobile: false
    });
    
    // Set a real user agent
    await page.setUserAgent(getRandomUserAgent());
    
    // Set some browser features that are normally enabled
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    });
    
    // Add realistic browser fingerprint values to evade detection
    await page.evaluateOnNewDocument(() => {
      // Override the WebGL fingerprint
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        // UNMASKED_VENDOR_WEBGL
        if (parameter === 37445) {
          return 'Intel Inc.';
        }
        // UNMASKED_RENDERER_WEBGL
        if (parameter === 37446) {
          return 'Intel Iris OpenGL Engine';
        }
        return getParameter.apply(this, arguments);
      };
      
      // Add language preferences
      Object.defineProperty(navigator, 'languages', {
        get: function() {
          return ['en-US', 'en', 'es'];
        },
      });
      
      // Set platform
      Object.defineProperty(navigator, 'platform', {
        get: function() {
          return 'Win32';
        },
      });
    });
    
    // Authenticate proxy BEFORE setting request interception
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });
    
    console.log('Navigating to page...');
    // Add some jitter to navigation to appear more human-like
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    console.log(`Page loaded: ${url}`);
    
    // Handle cookies popup with more human-like behavior
    try {
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('button, a'))
          .some(el => el.textContent.trim() === 'Accept all'),
        { timeout: 5000 }
      );
      
      // Add a small random delay before clicking like a human would
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
  
    // Simulate natural behavior - humans don't immediately press Escape
    await page.waitForTimeout(getRandomDelay(800, 1500));
    await page.keyboard.press('Escape');
    
    // Wait for login form with more human-like behavior
    await page.waitForSelector('#username');
    console.log('Username field found');
    
    // Type like a human - with variable speed
    await typeHumanLike(page, '#username', 'fsdg6342');
    console.log('Username entered');
    
    await page.waitForTimeout(getRandomDelay(300, 800));
    
    await page.waitForSelector('#password');
    await typeHumanLike(page, '#password', 'Gcwtkycs1997#');
    console.log('Password entered');
    
    // Add a natural pause before clicking the login button
    await page.waitForTimeout(getRandomDelay(800, 1500));
    
    // Move mouse to button first (like a human would) and then click
    const submitButton = await page.$('#sso-forms__submit');
    const buttonBox = await submitButton.boundingBox();
    
    // Move mouse to a random position on the button
    await page.mouse.move(
      buttonBox.x + buttonBox.width * Math.random(),
      buttonBox.y + buttonBox.height * Math.random(),
      { steps: 10 } // Move in steps for more realistic motion
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
    
    // Convert the screenshot Buffer to a Base64 string
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

// Function to type like a human with variable speed
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
