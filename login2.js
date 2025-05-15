const puppeteer = require("puppeteer");
const puppeteerExtra = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");
const UserAgentPlugin = require("puppeteer-extra-plugin-user-agent");
const FingerprintPlugin = require("puppeteer-extra-plugin-fingerprint");
require("dotenv").config();

// Apply the stealth plugin to puppeteer
puppeteerExtra.use(StealthPlugin());

// Configure realistic user agent
puppeteerExtra.use(UserAgentPlugin({
  userAgent: 'random',
  platform: 'random',
  hardwareConcurrency: 'random',
  deviceMemory: 'random'
}));

// Apply advanced fingerprinting protection
puppeteerExtra.use(FingerprintPlugin({
  browsers: ['chrome', 'firefox', 'safari'],
  devices: ['desktop'],
  locales: ['en-US', 'en-GB', 'de-DE', 'fr-FR'],
  // Use common screen sizes rather than suspicious dimensions
  screenSizes: ['1920x1080', '1366x768', '1440x900', '2560x1440']
}));

const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';
let browser; // Singleton browser instance

// Extended list of user agents for backup/fallback
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

// Get random user agent to make each session appear different
const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Get random screen resolution
const getRandomResolution = () => {
  return screenResolutions[Math.floor(Math.random() * screenResolutions.length)];
};

// Get random delay to simulate human interaction
const getRandomDelay = (min = 100, max = 500) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get realistic mouse movement pattern
const getHumanizedMouseMovement = (fromX, fromY, toX, toY, steps = 10) => {
  const points = [];
  // Bezier curve parameters to simulate human-like movement
  const bezierPoints = [
    { x: fromX, y: fromY },
    { x: fromX + (toX - fromX) * 0.3 + (Math.random() * 100 - 50), y: fromY + (toY - fromY) * 0.1 + (Math.random() * 100 - 50) },
    { x: fromX + (toX - fromX) * 0.7 + (Math.random() * 100 - 50), y: fromY + (toY - fromY) * 0.9 + (Math.random() * 100 - 50) },
    { x: toX, y: toY }
  ];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Cubic Bezier calculation
    const point = {
      x: Math.pow(1-t, 3) * bezierPoints[0].x + 
         3 * Math.pow(1-t, 2) * t * bezierPoints[1].x + 
         3 * (1-t) * Math.pow(t, 2) * bezierPoints[2].x + 
         Math.pow(t, 3) * bezierPoints[3].x,
      y: Math.pow(1-t, 3) * bezierPoints[0].y + 
         3 * Math.pow(1-t, 2) * t * bezierPoints[1].y + 
         3 * (1-t) * Math.pow(t, 2) * bezierPoints[2].y + 
         Math.pow(t, 3) * bezierPoints[3].y
    };
    points.push(point);
  }
  return points;
};

const initializeBrowser = async (proxy) => {
  if (!browser) {
    // Parse and format proxy URL properly
    const proxyUrl = new URL(proxy);
    const formattedProxy = `${proxyUrl.hostname}:${proxyUrl.port}`;
    
    const resolution = getRandomResolution();
    
    // Use puppeteer-extra instead of regular puppeteer
    browser = await puppeteerExtra.launch({
      headless: true,
      args: [
        `--proxy-server=${formattedProxy}`,
        `--window-size=${resolution.width},${resolution.height}`,
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-site-isolation-trials',
        '--disable-web-security',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // Prevent WebRTC from leaking IP
        '--disable-webrtc-encryption',
        '--disable-rtc-smoothness-algorithm',
        '--disable-webrtc-hw-decoding',
        '--disable-webrtc-hw-encoding',
        '--disable-webrtc-multiple-routes',
        '--disable-webrtc-hw-vp8-encoding',
        '--enforce-webrtc-ip-permission-check',
        '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-infobars',
        '--disable-breakpad',
        // Randomize timezone to match proxy location
        `--timezone=${getRandomTimezone()}`
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : executablePath(),
      ignoreHTTPSErrors: true,
      userDataDir: '/mnt/data/ev2'
    });
    console.log('Browser initialized with enhanced fingerprinting protection');
  }
  return browser;
};

// Generate a random timezone for added fingerprinting protection
function getRandomTimezone() {
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Singapore',
    'Australia/Sydney'
  ];
  return timezones[Math.floor(Math.random() * timezones.length)];
}

const go2 = async (res, url, user, pass, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const context = await browser.createIncognitoBrowserContext(); // Use incognito context for better isolation
    const page = await context.newPage();
    
    const resolution = getRandomResolution();
    
    // Configure the page for more realistic browsing
    await page.setViewport({ 
      width: resolution.width, 
      height: resolution.height,
      deviceScaleFactor: Math.random() > 0.5 ? 1 : 2,
      hasTouch: Math.random() > 0.9, // Occasionally simulate touch capability
      isLandscape: true,
      isMobile: false
    });
    
    // Enhanced HTTP headers with more variation
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
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Cache-Control': Math.random() > 0.5 ? 'max-age=0' : 'no-cache',
      'Connection': 'keep-alive',
      'DNT': Math.random() > 0.7 ? '1' : null // Randomly set Do Not Track
    });
    
    // Advanced evasion technique: Override permissions API
    await page.evaluateOnNewDocument(() => {
      // Override Permissions API
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => {
        if (parameters.name === 'notifications') {
          return Promise.resolve({ state: Notification.permission });
        }
        if (parameters.name === 'clipboard-read' || parameters.name === 'clipboard-write') {
          return Promise.resolve({ state: 'prompt' });
        }
        return originalQuery(parameters);
      };
      
      // Override sessionStorage and localStorage for consistent behaviors
      const orgSessionStorage = window.sessionStorage;
      Object.defineProperty(window, 'sessionStorage', {
        configurable: true,
        enumerable: true,
        value: orgSessionStorage
      });
      
      const orgLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        enumerable: true,
        value: orgLocalStorage
      });
      
      // Override Credential Management API
      if (window.PasswordCredential) {
        window.PasswordCredential = function() {};
      }
      
      // Override Media Capabilities API
      if (navigator.mediaCapabilities) {
        navigator.mediaCapabilities.decodingInfo = function() {
          return Promise.resolve({
            supported: true,
            smooth: true,
            powerEfficient: true
          });
        };
      }
      
      // Override WebGL debug renderer info
      const getExtension = WebGLRenderingContext.prototype.getExtension;
      WebGLRenderingContext.prototype.getExtension = function(name) {
        if (name === 'WEBGL_debug_renderer_info') {
          return null;
        }
        return getExtension.apply(this, arguments);
      };
      
      // Override Performance timing API to add some randomness
      const originalGetEntries = Performance.prototype.getEntries;
      Performance.prototype.getEntries = function() {
        const entries = originalGetEntries.apply(this, arguments);
        // Add small random variations to timing
        entries.forEach(entry => {
          if (entry.duration) {
            entry.duration += Math.random() * 2 - 1;
          }
          if (entry.startTime) {
            entry.startTime += Math.random() * 1 - 0.5;
          }
        });
        return entries;
      };
      
      // Make font fingerprinting more difficult
      (() => {
        // Save the original
        const originalGetComputedStyle = window.getComputedStyle;
        
        // Override with our version
        window.getComputedStyle = function() {
          const style = originalGetComputedStyle.apply(this, arguments);
          
          // Small chance to slightly modify the font to confuse fingerprinters
          if (Math.random() < 0.1) {
            const descriptors = Object.getOwnPropertyDescriptors(style);
            const fontProps = ['fontFamily', 'fontSize', 'fontWeight'];
            
            fontProps.forEach(prop => {
              if (descriptors[prop] && style[prop]) {
                Object.defineProperty(style, prop, {
                  get: function() {
                    if (prop === 'fontFamily' && descriptors[prop].get.call(style).includes('Arial')) {
                      return 'Arial, sans-serif';
                    }
                    if (prop === 'fontSize' && descriptors[prop].get.call(style) === '16px') {
                      return Math.random() < 0.5 ? '16px' : '16.01px';
                    }
                    return descriptors[prop].get.call(style);
                  }
                });
              }
            });
          }
          
          return style;
        };
      })();
    });
    
    // Authenticate proxy BEFORE setting request interception
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });
    
    // Simulate realistic pre-navigation behavior
    const currentPosition = { x: Math.floor(resolution.width / 2), y: Math.floor(resolution.height / 2) };
    
    // Random mouse movements before navigating (like a human idling)
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const randomX = Math.floor(Math.random() * resolution.width * 0.8) + resolution.width * 0.1;
      const randomY = Math.floor(Math.random() * resolution.height * 0.8) + resolution.height * 0.1;
      
      const points = getHumanizedMouseMovement(
        currentPosition.x, 
        currentPosition.y, 
        randomX, 
        randomY, 
        Math.floor(Math.random() * 5) + 5
      );
      
      for (const point of points) {
        await page.mouse.move(point.x, point.y);
        await page.waitForTimeout(Math.floor(Math.random() * 20) + 5);
      }
      
      currentPosition.x = randomX;
      currentPosition.y = randomY;
      
      // Occasionally scroll randomly
      if (Math.random() > 0.7) {
        await page.mouse.wheel({ deltaY: (Math.random() * 200) - 100 });
        await page.waitForTimeout(getRandomDelay(100, 300));
      }
    }
    
    console.log('Navigating to page...');
    // Add some jitter to navigation to appear more human-like
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    console.log(`Page loaded: ${url}`);
    
    // Pause and simulate a user examining the page
    await page.waitForTimeout(getRandomDelay(1000, 3000));
    
    // Scroll down slightly to simulate reading
    await page.mouse.wheel({ deltaY: 100 + Math.random() * 150 });
    await page.waitForTimeout(getRandomDelay(200, 800));
    
    // Sometimes scroll back up
    if (Math.random() > 0.5) {
      await page.mouse.wheel({ deltaY: -70 - Math.random() * 100 });
      await page.waitForTimeout(getRandomDelay(200, 600));
    }
    
    // Handle cookies popup with more human-like behavior
    try {
      // Look for common cookie accept button patterns
      const cookieSelectors = [
        'button:contains("Accept")', 
        'button:contains("Accept all")', 
        'a:contains("Accept")',
        'a:contains("Accept all")',
        'button:contains("Allow")',
        'button:contains("Allow all")',
        '[aria-label*="Accept"]',
        '[data-testid*="cookie-accept"]',
        '.cookie-consent-accept',
        '#accept-cookies'
      ];
      
      // Try to find any cookie consent button using a wide variety of selectors
      const cookieButton = await page.evaluate((selectors) => {
        for (const selector of selectors) {
          if (selector.includes(':contains(')) {
            // Handle :contains() pseudo-selector which isn't standard CSS
            const [tagName, textContent] = selector.split(':contains(');
            const text = textContent.replace(/["')]/g, '');
            const elements = Array.from(document.querySelectorAll(tagName));
            const element = elements.find(el => el.textContent.includes(text));
            if (element) return true;
          } else {
            // Standard CSS selector
            const element = document.querySelector(selector);
            if (element) return true;
          }
        }
        return false;
      }, cookieSelectors);
      
      if (cookieButton) {
        // Add a small random delay before clicking like a human would
        await page.waitForTimeout(getRandomDelay(800, 2000));
        
        // Try to click using multiple methods for reliability
        await page.evaluate((selectors) => {
          for (const selector of selectors) {
            try {
              if (selector.includes(':contains(')) {
                // Handle :contains() pseudo-selector
                const [tagName, textContent] = selector.split(':contains(');
                const text = textContent.replace(/["')]/g, '');
                const elements = Array.from(document.querySelectorAll(tagName));
                const element = elements.find(el => el.textContent.includes(text));
                if (element) {
                  element.click();
                  return;
                }
              } else {
                // Standard CSS selector
                const element = document.querySelector(selector);
                if (element) {
                  element.click();
                  return;
                }
              }
            } catch (e) {
              // Try next selector
            }
          }
        }, cookieSelectors);
        
        console.log('Cookie consent button clicked');
      }
    } catch (e) {
      console.log('No cookie consent dialog found, continuing');
    }
  
    // Pause and simulate natural human behavior
    await page.waitForTimeout(getRandomDelay(800, 1500));
    
    // Simulate pressing Escape to close any possible modal
    if (Math.random() > 0.7) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(getRandomDelay(300, 800));
    }
    
    // Wait for login form with more human-like behavior
    await page.waitForSelector('#username');
    console.log('Username field found');
    
    // Move mouse to the username field like a human would
    const usernameElement = await page.$('#username');
    const usernameBoundingBox = await usernameElement.boundingBox();
    
    // Generate human-like mouse movement to username field
    const usernameMousePoints = getHumanizedMouseMovement(
      currentPosition.x,
      currentPosition.y,
      usernameBoundingBox.x + usernameBoundingBox.width / 2 + (Math.random() * 10 - 5),
      usernameBoundingBox.y + usernameBoundingBox.height / 2 + (Math.random() * 10 - 5),
      15
    );
    
    // Execute the mouse movement
    for (const point of usernameMousePoints) {
      await page.mouse.move(point.x, point.y);
      await page.waitForTimeout(Math.floor(Math.random() * 15) + 5);
    }
    
    currentPosition.x = usernameBoundingBox.x + usernameBoundingBox.width / 2;
    currentPosition.y = usernameBoundingBox.y + usernameBoundingBox.height / 2;
    
    // Click the username field
    await page.mouse.click(currentPosition.x, currentPosition.y);
    await page.waitForTimeout(getRandomDelay(100, 300));
    
    // Type like a human - with variable speed
    await typeHumanLike(page, '#username', 'fsdg6342');
    console.log('Username entered');
    
    await page.waitForTimeout(getRandomDelay(300, 800));
    
    // Wait for password field
    await page.waitForSelector('#password');
    
    // Move mouse to password field
    const passwordElement = await page.$('#password');
    const passwordBoundingBox = await passwordElement.boundingBox();
    
    // Generate human-like mouse movement to password field
    const passwordMousePoints = getHumanizedMouseMovement(
      currentPosition.x,
      currentPosition.y,
      passwordBoundingBox.x + passwordBoundingBox.width / 2 + (Math.random() * 10 - 5),
      passwordBoundingBox.y + passwordBoundingBox.height / 2 + (Math.random() * 10 - 5),
      10
    );
    
    // Execute the mouse movement
    for (const point of passwordMousePoints) {
      await page.mouse.move(point.x, point.y);
      await page.waitForTimeout(Math.floor(Math.random() * 15) + 5);
    }
    
    currentPosition.x = passwordBoundingBox.x + passwordBoundingBox.width / 2;
    currentPosition.y = passwordBoundingBox.y + passwordBoundingBox.height / 2;
    
    // Click the password field
    await page.mouse.click(currentPosition.x, currentPosition.y);
    await page.waitForTimeout(getRandomDelay(100, 300));
    
    // Type password with human-like timing
    await typeHumanLike(page, '#password', 'Gcwtkycs1997#');
    console.log('Password entered');
    
    // Add a natural pause before clicking the login button
    await page.waitForTimeout(getRandomDelay(800, 1500));
    
    // Move mouse to login button with human-like movement
    const submitButton = await page.$('#sso-forms__submit');
    const buttonBox = await submitButton.boundingBox();
    
    // Random target position on the button
    const targetX = buttonBox.x + buttonBox.width * (0.3 + Math.random() * 0.4);
    const targetY = buttonBox.y + buttonBox.height * (0.3 + Math.random() * 0.4);
    
    // Generate human-like mouse movement to the button
    const loginButtonMousePoints = getHumanizedMouseMovement(
      currentPosition.x,
      currentPosition.y,
      targetX,
      targetY,
      12
    );
    
    // Execute the mouse movement
    for (const point of loginButtonMousePoints) {
      await page.mouse.move(point.x, point.y);
      await page.waitForTimeout(Math.floor(Math.random() * 15) + 5);
    }
    
    // Small hesitation before clicking (very human-like)
    await page.waitForTimeout(getRandomDelay(200, 500));
    
    // Click the button
    await page.mouse.click(targetX, targetY);
    console.log('Login button clicked');
    
    // Wait for navigation after login
    await page.waitForTimeout(5000);
    
    // Take screenshot with compression to reduce size
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 30,
      fullPage: true
    });
    
    // Convert the screenshot Buffer to a Base64 string
    const base64Screenshot = screenshotBuffer.toString('base64');
    console.log(base64Screenshot);
    console.log('Task completed successfully');
    
    // Don't close the page - keep it for future reuse
    // However, we'll release the incognito context
    await context.close();
    
  } catch (e) {
    console.error(e);
    if (res && res.send) {
      res.send(`Something went wrong while running: ${e}`);
    }
  }
};

// Function to type like a human with variable speed and occasional mistakes
async function typeHumanLike(page, selector, text) {
  const element = await page.$(selector);
  await element.click({ clickCount: 3 }); // Select all existing text
  await page.waitForTimeout(getRandomDelay(100, 300));
  
  // Type each character with variable delay and occasional errors
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Occasionally make a typo (1% chance) but only if not the last character
    if (Math.random() < 0.01 && i < text.length - 1) {
      // Type a wrong character (adjacent on keyboard)
      const wrongChar = getAdjacentKey(char);
      await page.type(selector, wrongChar, { delay: getRandomDelay(30, 150) });
      
      // Pause briefly as if noticing the error
      await page.waitForTimeout(getRandomDelay(200, 400));
      
      // Press backspace to delete the error
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(getRandomDelay(100, 200));
      
      // Now type the correct character
      await page.type(selector, char, { delay: getRandomDelay(30, 150) });
    } else {
      // Type normally with variable speed
      const delay = getRandomDelay(30, 150);
      
      // Occasionally type faster or slower for more realism
      const adjustedDelay = Math.random() < 0.1 ? 
                          delay * (Math.random() < 0.5 ? 0.5 : 2) : 
                          delay;
                          
      await page.type(selector, char, { delay: adjustedDelay });
    }
    
    // Occasionally pause while typing (as if thinking)
    if (Math.random() < 0.05) {
      await page.waitForTimeout(getRandomDelay(300, 800));
    }
  }
}

// Helper function to get an adjacent key on the keyboard for realistic typos
function getAdjacentKey(char) {
  const keyboardLayout = {
    'a': ['q', 's', 'z'],
    'b': ['v', 'g', 'h', 'n'],
    'c': ['x', 'd', 'f', 'v'],
    'd': ['s', 'e', 'r', 'f', 'c', 'x'],
    'e': ['w', 's', 'd', 'r'],
    'f': ['d', 'r', 't', 'g', 'v', 'c'],
    'g': ['f', 't', 'y', 'h', 'b', 'v'],
    'h': ['g', 'y', 'u', 'j', 'n', 'b'],
    'i': ['u', 'j', 'k', 'o'],
    'j': ['h', 'u', 'i', 'k', 'm', 'n'],
    'k': ['j', 'i', 'o', 'l', 'm'],
    'l': ['k', 'o', 'p'],
    'm': ['n', 'j', 'k'],
    'n': ['b', 'h', 'j', 'm'],
    'o': ['i', 'k', 'l', 'p'],
    'p': ['o', 'l'],
    'q': ['w', 'a'],
    'r': ['e', 'd', 'f', 't'],
    's': ['a', 'w', 'e', 'd', 'x', 'z'],
    't': ['r', 'f', 'g', 'y'],
    'u': ['y', 'h', 'j', 'i'],
    'v': ['c', 'f', 'g', 'b'],
    'w': ['q', 'a', 's', 'e'],
    'x': ['z', 's', 'd', 'c'],
    'y': ['t', 'g', 'h', 'u'],
    'z': ['a', 's', 'x'],
    '0': ['9', '-'],
    '1': ['2', '`'],
    '2': ['1', '3', 'q'],
    '3': ['2', '4', 'w'],
    '4': ['3', '5', 'e'],
    '5': ['4', '6', 'r'],
    '6': ['5', '7', 't'],
    '7': ['6', '8', 'y'],
    '8': ['7', '9', 'u'],
    '9': ['8', '0', 'i'],
    ' ': ['c', 'v', 'b', 'n', 'm']
  };

  const lowerChar = char.toLowerCase();
  if (keyboardLayout[lowerChar]) {
    const adjacentKeys = keyboardLayout[lowerChar];
    const randomAdjacentKey = adjacentKeys[Math.floor(Math.random() * adjacentKeys.length)];
    return char === lowerChar ? randomAdjacentKey : randomAdjacentKey.toUpperCase();
  }
  return char; // If no adjacent keys defined, return the original character
}

module.exports = { go2 };
