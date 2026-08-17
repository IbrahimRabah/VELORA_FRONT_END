const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://localhost:4201/auth/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: 'C:/Users/User/AppData/Local/Temp/login-desktop-ar.png', fullPage: true });

  await page.setViewportSize({ width: 375, height: 800 });
  await page.screenshot({ path: 'C:/Users/User/AppData/Local/Temp/login-mobile-ar.png', fullPage: true });

  await browser.close();
})();
