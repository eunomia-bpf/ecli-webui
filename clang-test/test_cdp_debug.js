const puppeteer = require('puppeteer-core');

(async () => {
    try {
        const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
        
        await page.goto('http://localhost:5173/');
        
        // Wait using a promise
        await new Promise(r => setTimeout(r, 2000));
        
        // Print window.Emception
        await page.evaluate(() => {
            console.log("window Object keys related to emception:", Object.keys(window).filter(k => k.toLowerCase().includes('emception')));
        });
        
        await page.close();
        browser.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
})();
