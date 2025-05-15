const puppeteer = require("puppeteer");
require("dotenv").config();
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';
let browser; // Singleton browser instance

// Expanded and more diverse user agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0'
];

// More realistic viewport sizes
const viewports = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1536, height: 864 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 }
];

// Get random user agent
const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Get random viewport
const getRandomViewport = () => {
  return viewports[Math.floor(Math.random() * viewports.length)];
};

// Get random delay with more human-like distribution
const getRandomDelay = (min = 100, max = 500) => {
  // Use normal distribution to cluster around middle values (more realistic)
  let rand = 0;
  for (let i = 0; i < 3; i++) {
    rand += Math.random();
  }
  rand = rand / 3;
  
  return Math.floor(rand * (max - min + 1)) + min;
};

// Add jitter to mouse movements
const addMouseJitter = async (page, x, y, steps = 10) => {
  const startX = (await page.evaluate('window.innerWidth')) / 2;
  const startY = (await page.evaluate('window.innerHeight')) / 2;
  
  // Create a slightly curved path with small random variations
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    // Add slight curve to path
    const curveX = Math.sin(progress * Math.PI) * 20;
    
    const currentX = startX + (x - startX) * progress + curveX;
    const currentY = startY + (y - startY) * progress;
    
    // Add small random jitter
    const jitterX = currentX + (Math.random() - 0.5) * 10;
    const jitterY = currentY + (Math.random() - 0.5) * 10;
    
    await page.mouse.move(jitterX, jitterY);
    await page.waitForTimeout(getRandomDelay(10, 25));
  }
  
  // Final precise position
  await page.mouse.move(x, y);
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
        '--disable-blink-features=AutomationControlled', // Critical: Mask automation
        '--disable-features=IsolateOrigins', 
        '--disable-site-isolation-trials',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--lang=en-US,en',
        '--no-first-run',
        '--no-zygote'
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
      ignoreHTTPSErrors: true,
      userDataDir: '/mnt/data/envato222'
    });
    console.log('Browser initialized');
  }
  return browser;
};

const go2 = async (res, url, user, pass, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const page = await browser.newPage();
    
    // Set a random viewport
    const viewport = getRandomViewport();
    await page.setViewport({
      ...viewport,
      deviceScaleFactor: Math.random() > 0.5 ? 1 : 1.25, // Sometimes use retina
      hasTouch: false,
      isLandscape: true,
      isMobile: false
    });
    
    // Set a real user agent
    const userAgent = getRandomUserAgent();
    await page.setUserAgent(userAgent);
    
    // Set common headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive'
    });
    
    // Advanced browser fingerprinting evasion
    await page.evaluateOnNewDocument(() => {
      // Override WebGL fingerprinting
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
      
      // Override Canvas fingerprinting
      const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(type) {
        if (this.width === 16 && this.height === 16) {
          // Small canvas typically used for fingerprinting
          return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAABGJJREFUOBFtU21MW1UYfu7XvZS29pZCYUBhIsgGZE43cMsmEKfGH2ycmixZ4tSYLPGXJsZf+9Ef+8Mfi9nMjGGJJs7E6GJ0JHO6bGSTjLFsUthYKVCB3n59v9bec3y/6CZLT9579znPeZ7nOed9CXXuws3iee/lvE65UCZdD3K3/X+wu5hBeH/MMB+HDdPH80rp6QIpFUiav+s9uX/t7xO3R85MFJ5Jhnjr3wlUnx+3r3P7tV7FfspKCacJ6bdlgRMEDjK0j+GwXyMkYrG0z1z4ejHRO1LdunTrBSZPe7XGWEpxehFpvBBP82mkxSqo5QKoioVoUgeRdCj5IiK+LEq6HT9OBB/mXY0/PPjd7Qr7dYpjDsXYR+R5kk4n0DI8BJnJmIxlMXPyHGbOX4ZILxJvExPOJvS7nyF+9iJScxm8c/yrn8Ydxz1s/HqhA4tKo+EYA9wUQu4UenZ3dB48gH3P78PAcWkdSXnm+vGr4PKFUclxVC8W0T1dQHpSRfPGtmEeStcl+k+iy3gJB4d8GB7ehw8+PIF7E5P0v8HMHO5cuoJR9xEkhCHBL7A7noXNPRJl+WIVTW2HGIUuGDkN3g0bsbm/H5tbkphezqH5y3/DarUiJLr+VN67Zaf8eMARDRE1B6i63WQzZXI+EXfAUC1YaGiHOxTAVHYFy4qOR60OLCxmsKVpO4LxBKF3uizJpJ2LVEWTJKKaSTG4bBUQe4WC1XuLEBhB2GbDHWECjlgfSsUieKpSq9VmHhOyTXpIAjQFM0VJYCcXrLIr9MRagrjJA5QWoQgVWF0ulMoK7Yn/kEhmYS3OJ0XJQUj+cRBmSNKlZKmCXCFr3jtY0m2QK7bmnpwJrJSL0AkDj3sG0BNKYPD0d1DiH4FUJJjQSWTtEgTv1lmjPDvE/Jnj0MHdXnMpZBJsGMk5FZkNzZBLFXZiHgzNsJPbGEiCT5qJPSbBTjnMdXYLJzsDmF6vP+TnuFCfn//t5Z7pPmLTFCXESTZg+AhsQh5jM3dx5sRJuJmTSiOxEidkBYgtZcEQgDLc7DmUcqOH1lxsmG4rrtyb1FrnxseuDA01bVtdA6vUPSM5uKMxDNjLaNZ1PHJ5kUo9RSLiQXQ+DlHRkQvY0dvbja5YFNHXhm+PNUQeuzV5+1DdRLWbWcWyqpmJYHMQWwY24cpEDLMpC0qyFa0tCvydHrz99ptwOhRUyhUoVhv6Qg1o9XkQeWf4u9GO1itnvzuKOrG+hVZrNUwKcCZnw7vLhu4dw7hxZwH+wDAGD75iGkjCwrE+CdKLFpAMhmGbjaP77cOfnfJ4fQkz3lqM9cUUytUq2xYIahwkQtHZFcXC9DTCwRZYLFbTUBzD6HoBkVgc5bkUHK3tC+GXXjncFO6MrMVc71R7yxrQ7/ezGfcFg/B5PeZ9oVxFOp3G+soK0plMwR8M3nA1+A+73f7lp7cOfn7r6B/oD75MJXFLhQAAAABJRU5ErkJggg==';
        }
        return origToDataURL.apply(this, arguments);
      };
      
      // Add language preferences
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en', 'es'],
      });
      
      // Set platform based on user agent
      const userAgent = navigator.userAgent.toLowerCase();
      let platform = 'Win32';
      if (userAgent.includes('macintosh')) {
        platform = 'MacIntel';
      } else if (userAgent.includes('linux')) {
        platform = 'Linux x86_64';
      }
      
      Object.defineProperty(navigator, 'platform', {
        get: () => platform,
      });
      
      // Add realistic plugins array (empty in headless)
      Object.defineProperty(navigator, 'plugins', {
        get: () => {
          const plugins = [];
          // Chrome PDF Plugin
          if (navigator.userAgent.includes('Chrome')) {
            const chromePlugin = {
              name: 'Chrome PDF Plugin',
              filename: 'internal-pdf-viewer',
              description: 'Portable Document Format',
              length: 1
            };
            plugins.push(chromePlugin);
          }
          return plugins;
        }
      });
      
      // Override automation-related properties
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      
      // Hide automation flags in chrome
      if (window.chrome) {
        window.chrome.runtime = {};
        window.chrome.runtime.sendMessage = () => {};
      }
      
      // Add a fake timezone to match typical users
      const originalDate = Date;
      Date = class extends originalDate {
        constructor(...args) {
          super(...args);
          if (args.length === 0) {
            // Random offset to simulate a specific timezone (e.g., Eastern US)
            const offset = -5 * 60; // -5 hours in minutes
            const adjustedTime = super.getTime() + offset * 60000;
            return new originalDate(adjustedTime);
          }
          return new originalDate(...args);
        }
      };
      
      // Add hardware concurrency - typical value for modern machines
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 8
      });
      
      // Add device memory - typical value
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 8
      });
    });
    
    // Authenticate proxy
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });
    
    console.log('Navigating to page...');
    
    // Simulate tab/window activation before navigation (more realistic)
    await page.evaluate(() => {
      window.dispatchEvent(new Event('focus'));
      document.hasFocus = () => true;
    });
    
    // Random pre-navigation delay (like a human deciding what to do)
    await page.waitForTimeout(getRandomDelay(500, 1200));
    
    // Navigate with realistic wait condition
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    console.log(`Page loaded: ${url}`);
    
    // Realistic scrolling behavior after page load
    await page.evaluate(async () => {
      const scrollDown = () => {
        window.scrollBy({
          top: Math.floor(Math.random() * 100) + 50,
          behavior: 'smooth'
        });
      };
      
      // Scroll a few times with random delays
      for (let i = 0; i < 3; i++) {
        scrollDown();
        await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
      }
      
      // Scroll back up a bit
      window.scrollBy({
        top: -150,
        behavior: 'smooth'
      });
    });
    
    await page.waitForTimeout(getRandomDelay(400, 800));
    
    // Handle cookies popup with more human-like behavior
    try {
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll('button, a'))
          .some(el => el.textContent.trim().toLowerCase().includes('accept')),
        { timeout: 5000 }
      );
      
      // Delay before clicking like a human would
      await page.waitForTimeout(getRandomDelay(800, 1700));
      
      await page.evaluate(() => {
        const acceptButtons = Array.from(document.querySelectorAll('button, a'))
          .filter(el => 
            el.textContent.trim().toLowerCase().includes('accept') || 
            el.textContent.trim().toLowerCase().includes('agree') ||
            el.textContent.trim().toLowerCase().includes('ok')
          );
          
        if (acceptButtons.length > 0) {
          // Click the first matching button
          const buttonToClick = acceptButtons[0];
          
          // Get button position for more realistic click
          const rect = buttonToClick.getBoundingClientRect();
          const x = rect.left + rect.width / 2 + (Math.random() * 10 - 5);
          const y = rect.top + rect.height / 2 + (Math.random() * 6 - 3);
          
          // Create and dispatch mouse events for realism
          const moveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            clientX: x,
            clientY: y
          });
          buttonToClick.dispatchEvent(moveEvent);
          
          // Brief pause between move and click
          setTimeout(() => {
            buttonToClick.click();
          }, 150);
        }
      });
      console.log('Cookie consent handled');
    } catch (e) {
      console.log('No cookie consent dialog found, continuing');
    }
    
    // Additional human-like behavior: random mouse movements before login
    await page.evaluate(() => {
      // Move cursor randomly around page
      document.addEventListener('mousemove', (e) => {
        // Log movement to make it look like real browser activity
        if (Math.random() < 0.01) {
          console.debug('Mouse position:', e.clientX, e.clientY);
        }
      });
    });
  
    // Simulate natural behavior - humans don't immediately press Escape
    await page.waitForTimeout(getRandomDelay(1200, 2000));
    
    // Sometimes humans press Escape to close popups
    if (Math.random() > 0.6) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(getRandomDelay(300, 800));
    }
    
    // Wait for login form
    await page.waitForSelector('#username');
    console.log('Username field found');
    
    // Click the field like a human would
    const usernameField = await page.$('#username');
    const usernameBounds = await usernameField.boundingBox();
    
    // Move mouse to input with slight randomization 
    const userX = usernameBounds.x + usernameBounds.width / 2 + (Math.random() * 10 - 5); 
    const userY = usernameBounds.y + usernameBounds.height / 2 + (Math.random() * 4 - 2);
    await addMouseJitter(page, userX, userY);
    
    // Click and wait as a human would
    await page.mouse.click(userX, userY);
    await page.waitForTimeout(getRandomDelay(200, 500));
    
    // Type username like a human
    await typeHumanLike(page, '#username', 'fsdg6342');
    console.log('Username entered');
    
    // Natural pause before moving to password field
    await page.waitForTimeout(getRandomDelay(500, 1200));
    
    // Find password field and click it
    await page.waitForSelector('#password');
    const passwordField = await page.$('#password');
    const passwordBounds = await passwordField.boundingBox();
    
    // Move mouse to password field with jitter
    const passX = passwordBounds.x + passwordBounds.width / 2 + (Math.random() * 10 - 5); 
    const passY = passwordBounds.y + passwordBounds.height / 2 + (Math.random() * 4 - 2);
    await addMouseJitter(page, passX, passY);
    
    await page.mouse.click(passX, passY);
    await page.waitForTimeout(getRandomDelay(200, 500));
    
    // Type password like a human
    await typeHumanLike(page, '#password', 'Gcwtkycs1997#');
    console.log('Password entered');
    
    // Natural pause before clicking login button
    await page.waitForTimeout(getRandomDelay(800, 1800));
    
    // Find submit button
    const submitButton = await page.$('#sso-forms__submit');
    const buttonBox = await submitButton.boundingBox();
    
    // Calculate a random position within the button (more human-like)
    const clickX = buttonBox.x + buttonBox.width * (0.3 + Math.random() * 0.4);
    const clickY = buttonBox.y + buttonBox.height * (0.3 + Math.random() * 0.4);
    
    // Move mouse to button with realistic motion
    await addMouseJitter(page, clickX, clickY);
    
    // Brief pause before clicking (like a human verifying before clicking)
    await page.waitForTimeout(getRandomDelay(100, 300));
    
    // Click the button
    await page.mouse.click(clickX, clickY);
    console.log('Login button clicked');
    
    // Wait for navigation after login with human-like patience
    const navigationTimeout = 8000 + Math.floor(Math.random() * 4000);
    await page.waitForTimeout(navigationTimeout);
    
    // More human-like post-login behavior
    await page.evaluate(async () => {
      // Random scrolling after login
      for (let i = 0; i < 2; i++) {
        const scrollAmount = 100 + Math.floor(Math.random() * 200);
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
        await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
      }
    });
    
    // Take screenshot - compress to reduce bandwidth
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

// Function to type like a human with variable speed and mistakes
async function typeHumanLike(page, selector, text) {
  const element = await page.$(selector);
  
  // Sometimes click once, sometimes triple-click to select all
  if (Math.random() > 0.7) {
    await element.click({ clickCount: 3 }); // Select all existing text
  } else {
    await element.click(); // Just click once
  }
  
  await page.waitForTimeout(getRandomDelay(100, 300));
  
  // Sometimes clear field with backspace/delete instead of selection
  const existingText = await page.evaluate(sel => {
    return document.querySelector(sel).value || '';
  }, selector);
  
  if (existingText && Math.random() > 0.5) {
    for (let i = 0; i < existingText.length; i++) {
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(getRandomDelay(10, 40));
    }
  }
  
  // Occasionally make a typo and correct it
  const shouldMakeTypo = Math.random() > 0.7;
  
  // Type each character with variable delay
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Simulate typo
    if (shouldMakeTypo && i === Math.floor(text.length / 2)) {
      // Type wrong character
      const wrongChar = String.fromCharCode(char.charCodeAt(0) + 1);
      await page.type(selector, wrongChar, { delay: getRandomDelay(30, 120) });
      
      // Pause as if noticing mistake
      await page.waitForTimeout(getRandomDelay(300, 700));
      
      // Delete wrong character
      await page.keyboard.press('Backspace');
      await page.waitForTimeout(getRandomDelay(200, 400));
      
      // Type correct character after a pause
      await page.waitForTimeout(getRandomDelay(200, 400));
    }
    
    // Variable typing speed - slow down for special characters
    const isSpecialChar = !char.match(/[a-zA-Z0-9]/);
    const typingDelay = isSpecialChar 
      ? getRandomDelay(70, 200)  // Slower for special chars
      : getRandomDelay(30, 150); // Normal speed for letters/numbers
    
    await page.type(selector, char, { delay: typingDelay });
    
    // Sometimes pause in the middle of typing (like a human thinking)
    if (i > 0 && i % 4 === 0 && Math.random() > 0.8) {
      await page.waitForTimeout(getRandomDelay(300, 800));
    }
  }
  
  // Sometimes humans click away from the field after typing
  if (Math.random() > 0.7) {
    // Click in a random empty spot on the page
    const viewport = await page.viewport();
    await page.mouse.click(
      Math.floor(Math.random() * viewport.width * 0.9) + viewport.width * 0.05,
      Math.floor(Math.random() * viewport.height * 0.7) + viewport.height * 0.2
    );
  }
}

module.exports = { go2 };
