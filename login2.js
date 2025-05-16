const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');
require('dotenv').config();

// Add the stealth plugin to puppeteer (comprehensive configuration)
puppeteer.use(StealthPlugin());

const proxyUsername = 'msnmmayl';
const proxyPassword = '626he4yucyln';
let browser; // Singleton browser instance

// Enhanced and more diverse user agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.59 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.87 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Safari/537.36 Edg/122.0.2365.80',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.58 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0'
];

// Common screen resolutions (more varied)
const screenResolutions = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 2560, height: 1440 },
  { width: 1280, height: 720 },
  { width: 1680, height: 1050 },
  { width: 1600, height: 900 },
  { width: 1024, height: 768 },
  { width: 3840, height: 2160 }
];

// Common time zones
const timeZones = [
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/Berlin'
];

// Helper functions
const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];
const getRandomResolution = () => screenResolutions[Math.floor(Math.random() * screenResolutions.length)];
const getRandomTimeZone = () => timeZones[Math.floor(Math.random() * timeZones.length)];

// Browser language profiles
const languageProfiles = [
  { languages: ['en-US', 'en'] },
  { languages: ['en-US', 'en', 'es'] },
  { languages: ['en-GB', 'en'] },
  { languages: ['fr-FR', 'fr', 'en'] },
  { languages: ['de-DE', 'de', 'en'] },
  { languages: ['ja-JP', 'ja'] },
  { languages: ['zh-CN', 'zh'] }
];

const getRandomLanguageProfile = () => languageProfiles[Math.floor(Math.random() * languageProfiles.length)];

const initializeBrowser = async (proxy) => {
  if (!browser) {
    // Parse and format proxy URL properly
    const proxyUrl = new URL(proxy);
    const formattedProxy = `${proxyUrl.hostname}:${proxyUrl.port}`;
    const resolution = getRandomResolution();
    const timeZone = getRandomTimeZone();
    
    // Generate random WebGL, Canvas, and AudioContext fingerprints
    const webglVendor = Math.random() > 0.5 ? 'Google Inc. (NVIDIA)' : 'Intel Inc.';
    const webglRenderer = Math.random() > 0.5 ? 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0)' : 'ANGLE (Intel, Intel(R) Iris(TM) Plus Graphics Direct3D11 vs_5_0 ps_5_0)';
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${formattedProxy}`,
        `--window-size=${resolution.width},${resolution.height}`,
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-site-isolation-trials',
        '--disable-web-security',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=AutomationControlled',
        `--user-agent=${getRandomUserAgent()}`,
        `--timezone=${timeZone}`,
        '--disable-infobars',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
        '--force-color-profile=srgb',
        '--disable-accelerated-2d-canvas',
        '--hide-scrollbars'
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : executablePath(),
      ignoreHTTPSErrors: true,
      userDataDir: '/mnt/data/ev2',
      defaultViewport: null // Let the viewport be determined by the window size
    });
    
    console.log('Browser initialized with enhanced stealth plugin');
  }
  return browser;
};

const go2 = async (res, url, user, pass, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const page = await browser.newPage();
    
    const resolution = getRandomResolution();
    const languageProfile = getRandomLanguageProfile();
    const userAgent = getRandomUserAgent();
    
    // Set viewport with random dimensions
    await page.setViewport({ 
      width: resolution.width, 
      height: resolution.height,
      deviceScaleFactor: Math.random() > 0.7 ? 1 : Math.random() > 0.5 ? 1.5 : 2,
      hasTouch: Math.random() > 0.9,
      isLandscape: true,
      isMobile: false
    });
    
    // Set user agent
    await page.setUserAgent(userAgent);
    
    // Enhanced browser fingerprinting
    await page.evaluateOnNewDocument(() => {
      // Override navigator properties
      const newProto = navigator.__proto__;
      delete newProto.webdriver;
      
      // Random platform based on user agent
      const platforms = ['Win32', 'MacIntel', 'Linux x86_64'];
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      
      // Random hardware concurrency (number of CPU cores)
      const cpuCores = [2, 4, 6, 8, 12, 16];
      const randomCores = cpuCores[Math.floor(Math.random() * cpuCores.length)];
      
      // Random device memory
      const deviceMemoryOptions = [2, 4, 8, 16, 32];
      const randomMemory = deviceMemoryOptions[Math.floor(Math.random() * deviceMemoryOptions.length)];
      
      Object.defineProperties(navigator, {
        hardwareConcurrency: { get: () => randomCores },
        deviceMemory: { get: () => randomMemory },
        platform: { get: () => randomPlatform },
        plugins: { get: () => new Array(Math.floor(Math.random() * 8)) },
        webdriver: { get: () => false },
        maxTouchPoints: { get: () => Math.random() > 0.8 ? Math.floor(Math.random() * 10) : 0 }
      });
      
      // Mock WebRTC
      const webrtcKey = Object.keys(window).find(key => key.match(/webkitRTCPeerConnection|mozRTCPeerConnection|RTCPeerConnection/));
      if (webrtcKey) {
        const OrigPeerConnection = window[webrtcKey];
        const modifiedPeerConnection = function(...args) {
          const pc = new OrigPeerConnection(...args);
          const origCreateOffer = pc.createOffer;
          pc.createOffer = function(options) {
            return origCreateOffer.apply(this, [options])
              .then(offer => {
                const offerString = offer.sdp;
                return {
                  type: 'offer',
                  sdp: offerString,
                  toJSON: () => ({ type: 'offer', sdp: offerString })
                };
              });
          };
          return pc;
        };
        window[webrtcKey] = modifiedPeerConnection;
      }
      
      // Canvas fingerprint randomization
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, options) {
        const context = originalGetContext.apply(this, [type, options]);
        if (context && type === '2d') {
          const originalFillText = context.fillText;
          context.fillText = function(...args) {
            args[1] += Math.random() * 0.001; // Add tiny random offset
            args[2] += Math.random() * 0.001;
            return originalFillText.apply(this, args);
          };
          
          const originalRect = context.rect;
          context.rect = function(...args) {
            args.forEach((arg, i) => {
              if (typeof arg === 'number') {
                args[i] += Math.random() * 0.001;
              }
            });
            return originalRect.apply(this, args);
          };
        }
        return context;
      };
      
      // WebGL fingerprint modifications
      const getParameterProxyHandler = {
        apply: function(target, thisArg, args) {
          const param = args[0];
          // Handle WebGL fingerprinting params
          if (param === 37445) { // UNMASKED_VENDOR_WEBGL
            return 'Google Inc.';
          }
          if (param === 37446) { // UNMASKED_RENDERER_WEBGL
            return 'ANGLE (Intel, Intel(R) UHD Graphics Direct3D11 vs_5_0 ps_5_0)';
          }
          return target.apply(thisArg, args);
        }
      };
      
      // Override WebGL
      if (window.WebGLRenderingContext) {
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = new Proxy(getParameter, getParameterProxyHandler);
      }
      
      // Audio context fingerprint
      window.AudioContext = class extends window.AudioContext {
        createOscillator() {
          const oscillator = super.createOscillator();
          const origStart = oscillator.start;
          oscillator.start = function(...args) {
            args[0] = (args[0] || 0) + Math.random() * 0.01;
            return origStart.apply(this, args);
          };
          return oscillator;
        }
      };
      
      // Battery API
      if (navigator.getBattery) {
        navigator.getBattery = function() {
          return Promise.resolve({
            charging: Math.random() > 0.5,
            chargingTime: Math.floor(Math.random() * 5000),
            dischargingTime: Math.floor(Math.random() * 10000),
            level: Math.random()
          });
        };
      }
    });
    
    // Enhanced HTTP headers with realistic variations
    const acceptHeader = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';
    const acceptEncodingHeader = 'gzip, deflate, br';
    const acceptLanguageHeader = languageProfile.languages.join(',') + ';q=0.9';
    
    await page.setExtraHTTPHeaders({
      'Accept-Language': acceptLanguageHeader,
      'Accept': acceptHeader,
      'Accept-Encoding': acceptEncodingHeader,
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Ch-Ua': `"Chromium";v="123", "Not:A-Brand";v="24"`,
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': `"${Math.random() > 0.6 ? 'Windows' : 'macOS'}"`,
      'Cache-Control': Math.random() > 0.5 ? 'max-age=0' : 'no-cache'
    });
    
    // Authenticate proxy
    if (proxyUsername && proxyPassword) {
      await page.authenticate({
        username: proxyUsername,
        password: proxyPassword,
      });
    }
    
    console.log('Navigating to page...');
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    console.log(`Page loaded: ${url}`);

        // Take screenshot
    const screenshotBuffer2 = await page.screenshot({
      type: 'jpeg',
      quality: 30,
      fullPage: true
    });
    
    // Convert screenshot to Base64
    const base64Screenshot2 = screenshotBuffer2.toString('base64');
    console.log(base64Screenshot2);
    console.log('Task completed successfully');
    
    // Handle cookies popup (direct approach without human-like delays)
    try {
      await page.evaluate(() => {
        const acceptButtons = Array.from(document.querySelectorAll('button, a'))
          .filter(el => {
            const text = el.textContent.toLowerCase().trim();
            return text.includes('accept') || text.includes('agree') || text.includes('cookie') || 
                   text.includes('consent') || text.includes('got it');
          });
        
        if (acceptButtons.length > 0) {
          acceptButtons[0].click();
        }
      });
    } catch (e) {
      console.log('Cookie handling completed');
    }
  
    // Handle login form (direct approach)
    await page.waitForSelector('#username');
    await page.$eval('#username', (el, value) => { el.value = value }, 'fsdg6342');
    
    await page.waitForSelector('#password');
    await page.$eval('#password', (el, value) => { el.value = value }, 'Gcwtkycs1997#');
    
    // Click login button
    await page.click('#sso-forms__submit');
    
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

module.exports = { go2 };
