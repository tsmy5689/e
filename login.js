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
        '--disable-images',
        '--disable-media',
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-setuid-sandbox'
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

const scrapeLogic = async (res, url, user,password, proxy) => {
  try {
    const browser = await initializeBrowser(proxy);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Authenticate proxy BEFORE setting request interception
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });
   
    console.log('Page loaded');
    await page.goto(url);
    console.log('Page loaded');

  
    await page.waitForSelector('.sc-geXuza.cFkJpy.sc-fwzISk.jeWSVv');
    await page.waitForSelector('#username');
    // Type into the input field
    await page.type('#username', user, { delay: 100 });
    console.log('username type!');

     await page.waitForSelector('#password');
    // Type into the input field
    await page.type('#password', password, { delay: 100 });
    console.log('password type!');
   
    console.log('Task completed successfully');
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running : ${e}`);
  } finally {
    // Optionally close the browser if needed, but keeping it open for speed
    // await browser.close();
  }
};

module.exports = { scrapeLogic };