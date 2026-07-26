const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Go to local server
  await page.goto('http://localhost:3005/login');
  
  // Try to login if possible, or just look at login page for overlap
  await page.screenshot({ path: '/Users/usuario/.gemini/antigravity/brain/2646c861-d9fd-4bd7-be7c-6d7d69f52ffa/scratch/login.png' });
  
  await browser.close();
})();
