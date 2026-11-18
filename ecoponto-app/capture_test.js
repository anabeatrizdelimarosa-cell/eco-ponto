const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testCapture() {
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });
  await page.goto('http://localhost:3011', { waitUntil: 'networkidle0' });

  const targetPath = path.join(screenshotDir, '01_mapa_interativo.png');
  await page.screenshot({ path: targetPath });
  console.log('Screenshot saved to:', targetPath);

  await browser.close();
}

testCapture().catch(console.error);
