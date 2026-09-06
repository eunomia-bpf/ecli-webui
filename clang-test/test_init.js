const puppeteer = require('puppeteer-core');

(async () => {
    try {
        const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
        const page = await browser.newPage();
        
        page.on('console', msg => {
            if (!msg.text().includes('AxiosError') && !msg.text().includes('/task')) {
                console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
                // Print stack trace if it's an error
                if (msg.type() === 'error' && msg.args().length > 0) {
                    msg.args().forEach(async arg => {
                        try {
                            const err = await arg.jsonValue();
                            console.log(err);
                        } catch(e) {}
                    });
                }
            }
        });
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString(), err.stack));
        
        await page.goto('http://localhost:5173/');
        
        console.log("Waiting for Emception initialized...");
        await page.waitForFunction(() => {
            return document.body.innerText.includes("Emception initialized.") ||
                   document.body.innerText.includes("Emception init error");
        }, { timeout: 45000 });
        
        await page.close();
        browser.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
})();
