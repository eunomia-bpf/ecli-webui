const puppeteer = require('puppeteer-core');

(async () => {
    try {
        const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
        const page = await browser.newPage();
        
        await page.goto('http://localhost:5173/');
        
        // Wait for page load
        await new Promise(r => setTimeout(r, 2000));
        
        // Let's get the Packs URLs
        const packsUrls = await page.evaluate(async () => {
            // Emception loads packs. We can just import packs.mjs
            const packs = await import('/node_modules/emception/packs.mjs');
            return packs.default;
        });
        console.log("Packs URLs:", packsUrls);
        
        await page.close();
        browser.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
})();
