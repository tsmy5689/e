const puppeteer = require("puppeteer");
require("dotenv").config();
const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';
let browser; // Singleton browser instance

// Extended list of user agents for better variety
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

// Generate realistic device memory values (in GB)
const getRandomMemory = () => {
  const memories = [2, 4, 8, 16];
  return memories[Math.floor(Math.random() * memories.length)];
};

// Generate realistic hardware concurrency (CPU cores)
const getRandomConcurrency = () => {
  const cores = [2, 4, 6, 8, 12, 16];
  return cores[Math.floor(Math.random() * cores.length)];
};

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
        '--disable-blink-features=AutomationControlled',
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
    console.log('Browser initialized');
  }
  return browser;
};

const go2 = async (res, url, user, pass, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const page = await browser.newPage();
    
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
    
    // Set a real user agent
    const userAgent = getRandomUserAgent();
    await page.setUserAgent(userAgent);
    
    // Set more realistic HTTP headers
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
    
    // Comprehensive browser fingerprinting evasion
    await page.evaluateOnNewDocument(() => {
      // Define a more advanced fingerprint override object
      const fingerprintOverrides = {
        // Hardware and OS fingerprinting
        deviceMemory: 8,
        hardwareConcurrency: 8,
        platform: 'Win32',
        languages: ['en-US', 'en', 'es'],
        
        // WebGL fingerprinting
        webglVendor: 'Intel Inc.',
        webglRenderer: 'Intel Iris OpenGL Engine',
        
        // Canvas fingerprinting slight randomization
        canvasModifier: 0.0001,
        
        // Audio fingerprinting
        audioContextPrecision: 0.01,
        
        // Battery status
        batteryDischarging: true,
        batteryLevel: 0.75,
      };
      
      // -------- NAVIGATOR PROPERTIES --------
      
      // Override navigator properties with consistent values
      const navigatorProps = {
        hardwareConcurrency: fingerprintOverrides.hardwareConcurrency,
        deviceMemory: fingerprintOverrides.deviceMemory,
        platform: fingerprintOverrides.platform,
        languages: fingerprintOverrides.languages,
        maxTouchPoints: 0,
        userActivation: { hasBeenActive: true, isActive: true },
        webdriver: false,
        doNotTrack: null,
        plugins: [
          { description: 'Portable Document Format', filename: 'internal-pdf-viewer', length: 1, name: 'PDF Viewer' },
          { description: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', length: 1, name: 'Chrome PDF Viewer' }
        ]
      };
      
      // Apply navigator property overrides
      for (const [key, value] of Object.entries(navigatorProps)) {
        if (value !== undefined) {
          try {
            Object.defineProperty(navigator, key, {
              get: () => value
            });
          } catch (e) {
            console.warn(`Failed to override navigator.${key}`);
          }
        }
      }
      
      // -------- WEBGL FINGERPRINTING PROTECTION --------
      
      // Override WebGL fingerprinting methods
      const getParameterProxyHandler = {
        apply: function(target, thisArg, args) {
          // UNMASKED_VENDOR_WEBGL
          if (args[0] === 37445) {
            return fingerprintOverrides.webglVendor;
          }
          // UNMASKED_RENDERER_WEBGL
          if (args[0] === 37446) {
            return fingerprintOverrides.webglRenderer;
          }
          return target.apply(thisArg, args);
        }
      };
      
      // Apply WebGL proxy
      if (WebGLRenderingContext.prototype.getParameter) {
        WebGLRenderingContext.prototype.getParameter = new Proxy(
          WebGLRenderingContext.prototype.getParameter,
          getParameterProxyHandler
        );
      }
      
      // Also apply to WebGL2 if available
      if (window.WebGL2RenderingContext && WebGL2RenderingContext.prototype.getParameter) {
        WebGL2RenderingContext.prototype.getParameter = new Proxy(
          WebGL2RenderingContext.prototype.getParameter,
          getParameterProxyHandler
        );
      }
      
      // -------- CANVAS FINGERPRINTING PROTECTION --------
      
      // Add slight randomization to canvas data to prevent exact fingerprinting
      const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
      const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
      
      // Canvas fingerprinting protection - add small noise to canvas data
      HTMLCanvasElement.prototype.toDataURL = function() {
        if (Math.random() < 0.1) { // Only modify 10% of canvas actions to not break functionality
          const context = this.getContext('2d');
          if (context) {
            const imageData = context.getImageData(0, 0, this.width, this.height);
            const data = imageData.data;
            
            // Add slight noise to canvas data
            for (let i = 0; i < data.length; i += 4) {
              // Small random offset to each channel
              data[i] = Math.max(0, Math.min(255, data[i] + Math.floor(Math.random() * 2) - 1));
              data[i+1] = Math.max(0, Math.min(255, data[i+1] + Math.floor(Math.random() * 2) - 1));
              data[i+2] = Math.max(0, Math.min(255, data[i+2] + Math.floor(Math.random() * 2) - 1));
            }
            context.putImageData(imageData, 0, 0);
          }
        }
        return origToDataURL.apply(this, arguments);
      };
      
      // Similar protection for getImageData
      CanvasRenderingContext2D.prototype.getImageData = function() {
        const imageData = origGetImageData.apply(this, arguments);
        
        if (Math.random() < 0.1) { // Only modify some calls
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            // Tiny random offset
            data[i] = Math.max(0, Math.min(255, data[i] + Math.floor(Math.random() * 2) - 1));
            data[i+1] = Math.max(0, Math.min(255, data[i+1] + Math.floor(Math.random() * 2) - 1));
            data[i+2] = Math.max(0, Math.min(255, data[i+2] + Math.floor(Math.random() * 2) - 1));
          }
        }
        
        return imageData;
      };
      
      // -------- AUDIO FINGERPRINTING PROTECTION --------
      
      // Audio fingerprinting protection - add tiny variations to audio data
      if (window.AudioContext || window.webkitAudioContext) {
        const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
        window.AudioContext = window.webkitAudioContext = function() {
          const audioContext = new OriginalAudioContext(arguments);
          
          // Override getFloatFrequencyData
          const originalGetFloatFrequencyData = audioContext.getFloatFrequencyData;
          if (originalGetFloatFrequencyData) {
            audioContext.getFloatFrequencyData = function(array) {
              originalGetFloatFrequencyData.apply(this, arguments);
              // Add subtle variations to the frequency data
              for (let i = 0; i < array.length; i++) {
                array[i] += (Math.random() * 2 - 1) * fingerprintOverrides.audioContextPrecision;
              }
              return array;
            };
          }
          
          return audioContext;
        };
      }
      
      // -------- BATTERY API PROTECTION --------
      
      // Mock Battery API if it exists
      if (navigator.getBattery) {
        navigator.getBattery = function() {
          return Promise.resolve({
            charging: !fingerprintOverrides.batteryDischarging,
            chargingTime: fingerprintOverrides.batteryDischarging ? Infinity : 3600,
            dischargingTime: fingerprintOverrides.batteryDischarging ? 7200 : Infinity,
            level: fingerprintOverrides.batteryLevel,
            addEventListener: function() {},
            removeEventListener: function() {},
            dispatchEvent: function() { return true; }
          });
        };
      }
      
      // -------- AUTOMATION DETECTION PROTECTION --------
      
      // Hide automation-related properties
      const proxyWindowProps = {
        // Hide automated browser indicators
        domAutomation: undefined,
        domAutomationController: undefined,
        _WEBDRIVER_ELEM_CACHE: undefined,
        __WEBDRIVER_ELEM_CACHE: undefined,
        $cdc_asdjflasutopfhvcZLmcfl_: undefined,
        $chrome_asyncScriptInfo: undefined,
        __lastWatirAlert: undefined,
        __lastWatirConfirm: undefined,
        __lastWatirPrompt: undefined,
        _selenium: undefined,
        calledPhantom: undefined,
        calledSelenium: undefined,
        SELENIUM_CONTEXT: undefined,
        // Puppeteer specific
        puppeteer: undefined,
      };
      
      // Apply window property masks
      for (const [key, value] of Object.entries(proxyWindowProps)) {
        if (value !== undefined) {
          try {
            Object.defineProperty(window, key, {
              get: () => value,
              set: () => { },
              configurable: false
            });
          } catch (e) {}
        }
      }
      
      // Override toString methods to hide proxy functions
      const originalToString = Function.prototype.toString;
      Function.prototype.toString = function() {
        return originalToString.apply(this, arguments)
          .replace(/\[native code\]\n/g, "[native code]");
      };
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
    await page.waitForSelector('#password');
    console.log('new pass field found');
    
    // Type like a human - with variable speed
   // await typeHumanLike(page, '#username', 'fsdg6342');
    //console.log('Username entered');
    
    await page.waitForTimeout(getRandomDelay(300, 800));
    
    await page.waitForSelector('#password');
    await typeHumanLike(page, '#password', 'GGcwtkycs1997#');
    console.log('Password entered');
    
    // Add a natural pause before clicking the login button
    await page.waitForTimeout(getRandomDelay(800, 1500));
    
    // Move mouse to button first (like a human would) and then click
    const submitButton = await page.$('.sc-dHKmnV');
    const buttonBox = await submitButton.boundingBox();
    
    // Move mouse to a random position on the button
    await page.mouse.move(
      buttonBox.x + buttonBox.width * Math.random(),
      buttonBox.y + buttonBox.height * Math.random(),
      { steps: 10 } // Move in steps for more realistic motion
    );
    
    await page.waitForTimeout(getRandomDelay(100, 300));
    await page.click('.sc-dHKmnV');
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
