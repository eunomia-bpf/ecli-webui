const puppeteer = require('puppeteer-core');

(async () => {
    try {
        console.log("Connecting to Chromium CDP on port 9222...");
        const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
        
        console.log("Creating a new page...");
        const page = await browser.newPage();
        
        console.log("Navigating to http://localhost:5173/ ...");
        await page.goto('http://localhost:5173/');
        
        console.log("Waiting for Emception to initialize...");
        // Wait for the UI to be ready
        await page.waitForFunction(() => {
            return document.body.innerText.includes("Emception initialized.");
        }, { timeout: 30000 });
        console.log("Emception is initialized.");

        console.log("Selecting code tab if needed or setting test code...");
        // Wait for monaco to load and inject code
        await page.waitForFunction(() => window.monaco !== undefined, { timeout: 10000 }).catch(()=>console.log("No global monaco"));
        
        // Emception file system uses tabs. In EditorField.vue, tabs are in props.tabs.
        // The script in MainView.vue grabs `tabs.value.entries()`.
        // Let's create a `.c` file tab or just inject into existing if we can.
        // Wait, the default is "tab1". "tab1" does not end with ".c".
        // Let's inject a new tab into the Vue state if possible, or just click compile directly if it handles `.c`.
        
        // Actually, we can interact with the DOM.
        // MainView.vue:
        // const compileProgram = async () => ...
        // Let's just evaluate script to put a C file into tabs
        await page.evaluate(() => {
            // Find the vue instance or just patch the data
            // Since we exposed `emception` to window, we can test it directly!
            window.emception.fileSystem.writeFile('/test.c', 'int main() { return 0; }');
        });
        
        console.log("Clicking Compile button...");
        // Find the compile button. It has text "Compile"
        const [button] = await page.$x("//button[contains(., 'Compile')]");
        if (button) {
            await button.click();
        } else {
            console.log("Could not find Compile button via XPath. Trying querySelector...");
            await page.evaluate(() => {
                const btns = Array.from(document.querySelectorAll('button'));
                const compileBtn = btns.find(b => b.innerText.includes('Compile'));
                if (compileBtn) compileBtn.click();
            });
        }
        
        console.log("Waiting for compilation to finish...");
        await page.waitForFunction(() => {
            return document.body.innerText.includes("Compilation successful, ready to run") || 
                   document.body.innerText.includes("Compilation failed");
        }, { timeout: 10000 });
        
        // Print the console output
        const consoleLogs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.console-line, .bg-slate-50 div'))
                .map(e => e.innerText)
                .join('\\n');
        });
        console.log("Browser Console output:");
        console.log(consoleLogs);
        
        // Read standbyBinary if exposed, or just check the page text
        const pageText = await page.evaluate(() => document.body.innerText);
        console.log("Did compilation succeed?", pageText.includes("Compilation successful"));
        
        await page.close();
        browser.disconnect();
    } catch (e) {
        console.error("Error testing in browser:", e);
    }
})();
