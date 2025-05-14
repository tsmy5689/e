const puppeteer = require("puppeteer");
const puppeteer_extra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgentPlugin = require('puppeteer-extra-plugin-user-agent');
require("dotenv").config();

// Apply stealth plugin to make puppeteer undetectable
puppeteer_extra.use(StealthPlugin());

// Add realistic user agent
puppeteer_extra.use(UserAgentPlugin({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  platform: 'Win32'
}));

const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';

let browser; // Singleton browser instance

// Random delay function to mimic human behavior
const humanDelay = async (min = 500, max = 2000) => {
  const delay = Math.floor(Math.random() * (max - min) + min);
  await new Promise(resolve => setTimeout(resolve, delay));
  return delay;
};

// Human-like typing function
const humanType = async (page, selector, text) => {
  await page.waitForSelector(selector);
  
  // Click the field first (humans do this)
  await page.click(selector);
  await humanDelay(300, 800);
  
  // Type with random delays between keystrokes
  for (const char of text) {
    await page.type(selector, char, { delay: Math.floor(Math.random() * 150) + 30 });
    await humanDelay(10, 100);
  }
};

const initializeBrowser = async (proxy) => {
  if (!browser) {
    // Parse and format proxy URL properly
    const proxyUrl = new URL(proxy);
    const formattedProxy = `${proxyUrl.hostname}:${proxyUrl.port}`;

    browser = await puppeteer_extra.launch({
      headless: true,
      args: [
        `--proxy-server=${formattedProxy}`,
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-blink-features=AutomationControlled', // Disable the flag that indicates Chrome is automated
        '--disable-features=IsolateOrigins,site-per-process', // Disable site isolation
        '--window-size=1920,1080'  // Set a common screen resolution
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      ignoreHTTPSErrors: true,
      userDataDir: '/mnt/data/envato2222222',
      defaultViewport: null // Let viewport be determined by browser window size
    });
    console.log('Browser initialized');
  }
  console.log('Browser initialized2');
  return browser;
};

// Add mouse movement simulation
const simulateHumanMouseMovement = async (page) => {
  // Generate a random path for the mouse to follow
  const points = [];
  const numPoints = Math.floor(Math.random() * 5) + 3; // 3-7 points
  
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.floor(Math.random() * 800) + 100,
      y: Math.floor(Math.random() * 600) + 100
    });
  }
  
  // Move the mouse through these points with random delays
  for (const point of points) {
    await page.mouse.move(point.x, point.y, { steps: Math.floor(Math.random() * 5) + 5 });
    await humanDelay(100, 500);
  }
};

const go2 = async (res, url, user, pass, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const page = await browser.newPage();
    
    // Set a real user agent and viewport size
    await page.setViewport({ 
      width: 1920, 
      height: 1080,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: true,
      isMobile: false
    });

    // Set browser timezone, language and platform to make it more realistic
    await page.evaluateOnNewDocument(() => {
      // Override navigator properties to mask automation
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'es'] });
      Object.defineProperty(navigator, 'plugins', { get: () => [
        { name: 'Chrome PDF Plugin', description: 'Portable Document Format', filename: 'internal-pdf-viewer' },
        { name: 'Chrome PDF Viewer', description: '', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
        { name: 'Native Client', description: '', filename: 'internal-nacl-plugin' }
      ]});
      
      // Add a fake web audio fingerprint
      const audioContext = window.AudioContext || window.webkitAudioContext;
      if (audioContext) {
        const ctx = new audioContext();
        const origGetChannelData = ctx.createAnalyser().getChannelData;
        
        if (origGetChannelData) {
          Object.defineProperty(window.AnalyserNode.prototype, 'getChannelData', {
            value: function() {
              const results = origGetChannelData.apply(this, arguments);
              // Add slight variations to prevent fingerprinting
              for (let i = 0; i < results.length; i += 100) {
                results[i] = results[i] + Math.random() * 0.0001;
              }
              return results;
            }
          });
        }
      }
    });

    // Authenticate proxy BEFORE setting request interception
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });

    // Add random HTTP headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://www.google.com/',
      'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    });

    console.log('Page loaded2');
    
    // Navigate with timeout and waitUntil options (like a real browser)
    await page.goto(url, {
      waitUntil: ['domcontentloaded', 'networkidle2'],
      timeout: 30000
    });
    console.log(url);
    console.log('Page loaded');

    // Simulate random scrolling behavior
    await page.evaluate(async () => {
      const randomScrolls = Math.floor(Math.random() * 4) + 2; // 2-5 scrolls
      
      for (let i = 0; i < randomScrolls; i++) {
        const scrollAmount = Math.floor(Math.random() * 400) + 100;
        window.scrollBy(0, scrollAmount);
        await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
      }
    });
    
    // Simulate mouse movement
    await simulateHumanMouseMovement(page);

    // Handle cookies consent with human-like behavior
    try {
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('button, a'))
          .some(el => el.textContent.trim() === 'Accept all'),
        { timeout: 5000 } // Adjust timeout as needed
      );
      
      // Simulate human delay before clicking the button
      await humanDelay(800, 2000);
      
      await page.evaluate(() => {
        const button = Array.from(document.querySelectorAll('button, a'))
          .find(el => el.textContent.trim() === 'Accept all');
        if (button) {
          button.click();
        }
      });
      console.log('"Accept all" button clicked');
      
      // Wait a bit after clicking the button (like a human would)
      await humanDelay(1000, 2500);
    } catch (e) {
      console.log('"Accept all" button not found, continuing');
    }

    // Escape key press with delay
    await humanDelay(300, 800);
    await page.keyboard.press('Escape');
    await humanDelay(500, 1200);

    // Take screenshot with more realistic settings
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 85,
      fullPage: false
    });
    const base64Screenshot = screenshotBuffer.toString('base64');
    console.log(base64Screenshot);
    
    // Human-like typing for credentials
    await simulateHumanMouseMovement(page);
    await humanType(page, '#username', 'fsdg6342');
    console.log('username typed!');
    
    await humanDelay(800, 1500);
    await simulateHumanMouseMovement(page);
    await humanType(page, '#password', 'Gcwtkycs1997#');
    console.log('password typed!');
    
    // Wait like a human would before submitting
    await humanDelay(1500, 3000);
    
    // Move mouse to the login button before clicking
    const submitButton = await page.$('#sso-forms__submit');
    if (submitButton) {
      const buttonBox = await submitButton.boundingBox();
      if (buttonBox) {
        // Move to a random position near the button first
        await page.mouse.move(
          buttonBox.x - 50 + Math.random() * 100,
          buttonBox.y - 50 + Math.random() * 100,
          { steps: 10 }
        );
        
        // Then move to the button itself
        await page.mouse.move(
          buttonBox.x + buttonBox.width / 2 + (Math.random() * 10 - 5),
          buttonBox.y + buttonBox.height / 2 + (Math.random() * 10 - 5),
          { steps: 5 }
        );
        
        // Click the button
        await humanDelay(300, 800);
        await page.mouse.click(
          buttonBox.x + buttonBox.width / 2,
          buttonBox.y + buttonBox.height / 2
        );
      }
    } else {
      // Fallback to standard click if we can't find the button
      await page.click('#sso-forms__submit');
    }
    console.log('clicked login!');

    // Wait like a human would after login
    await humanDelay(3000, 5000);

    // Take final screenshot
    const finalScreenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 75,
      fullPage: true
    });
    const finalBase64Screenshot = finalScreenshotBuffer.toString('base64');
    console.log(finalBase64Screenshot);

    console.log('Task completed successfully');
  } catch (e) {
    console.error(e);
    if (res && typeof res.send === 'function') {
      res.send(`Something went wrong while running: ${e}`);
    }
  } finally {
    // Optionally close the browser if needed, but keeping it open for speed
    // await browser.close();
  }
};

module.exports = { go2 };
