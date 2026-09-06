import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({ 
    executablePath: '/run/current-system/sw/bin/chromium',
    headless: "new", 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:5173');
  // wait a bit for load
  await new Promise(r => setTimeout(r, 2000));
  
  // screenshot
  await page.screenshot({ path: '/home/riro/Src/ecli-webui/screenshot.png' });
  
  const buttons = await page.$$eval('button', btns => 
    btns.map(b => ({
      text: b.textContent,
      className: b.className,
      styleBg: window.getComputedStyle(b).backgroundColor,
      styleColor: window.getComputedStyle(b).color,
      width: window.getComputedStyle(b).width,
      height: window.getComputedStyle(b).height
    }))
  );
  
  console.log(JSON.stringify(buttons, null, 2));
  
  await browser.close();
})();
