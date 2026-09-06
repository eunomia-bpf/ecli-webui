import puppeteer from 'puppeteer-core';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ 
    executablePath: '/run/current-system/sw/bin/chromium',
    headless: "new", 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  console.log('Page loaded');
  
  // Clear IndexedDB
  await page.evaluate(async () => {
    const dbs = await window.indexedDB.databases();
    for (const db of dbs) {
      window.indexedDB.deleteDatabase(db.name);
    }
  });
  
  await page.goto('http://localhost:5173');

  // Wait for emception to initialize
  console.log('Waiting for Emception to initialize...');
  let initialized = false;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const consoleText = await page.evaluate(() => {
        const csl = document.querySelector('ul.list-none.font-mono');
        return csl ? csl.innerText : '';
    });
    if (consoleText.includes('Loaded BPF headers.')) {
        initialized = true;
        break;
    } else if (consoleText.includes('Init throwed') || consoleText.includes('LinkError')) {
        console.log("FAILED INITIALIZATION!");
        console.log(consoleText);
        await browser.close();
        process.exit(1);
    }
  }

  if (!initialized) {
      console.log('Timeout waiting for initialization');
      await browser.close();
      process.exit(1);
  }
  
  console.log('Emception initialized! Uploading main.c...');

  // Upload main.c
  await page.waitForSelector('input[type="file"]');
  const inputUploadHandle = await page.$('input[type="file"]');
  const filePath = path.resolve('/home/riro/Src/ecli-webui/main.c');
  await inputUploadHandle.uploadFile(filePath);
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Compile
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const btnText = await page.evaluate(el => el.textContent, btn);
    if (btnText && btnText.includes('Compile')) {
      console.log('Clicking Compile');
      await btn.click();
      break;
    }
  }

  console.log('Waiting for compilation to finish...');
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const consoleText = await page.evaluate(() => {
        const csl = document.querySelector('ul.list-none.font-mono');
        return csl ? csl.innerText : 'NO CONSOLE';
    });
    console.log(`[Console tick ${i}]:`, consoleText.trim().split('\n').slice(-5).join(' | '));
    if (consoleText.includes('Compilation exit code: 0')) {
        console.log('SUCCESS! Compilation exit code 0');
        break;
    } else if (consoleText.includes('fatal error:')) {
        console.log('FAILED! Compilation error');
        break;
    }
  }
  
  await browser.close();
})();
