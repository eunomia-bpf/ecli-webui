const puppeteer = require('puppeteer-core');

(async () => {
    try {
        const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
        const page = await browser.newPage();
        
        page.on('console', msg => {
            if (!msg.text().includes('AxiosError') && !msg.text().includes('/task')) {
                console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
            }
        });
        
        await page.goto('http://localhost:5173/');
        
        console.log("Waiting for Emception initialized...");
        await page.waitForFunction(() => {
            return document.body.innerText.includes("Emception initialized.");
        }, { timeout: 45000 });
        
        console.log("Testing clang -target bpf...");
        const result = await page.evaluate(async () => {
            const emception = window.emception;
            const res = emception._run_process(['/usr/bin/clang', '--version'], {
                print: (s) => console.log('STDOUT:', s),
                printErr: (s) => console.error('STDERR:', s),
                cwd: "/",
            });
            return res.returncode;
        });
        console.log("clang --version returned:", result);
        
        const result2 = await page.evaluate(async () => {
            const emception = window.emception;
            emception.fileSystem.writeFile('/test.c', 'int main() { return 0; }');
            const res = emception._run_process(['/usr/bin/clang', '-target', 'bpf', '-c', '/test.c', '-o', '/test.o'], {
                print: (s) => console.log('STDOUT:', s),
                printErr: (s) => console.error('STDERR:', s),
                cwd: "/",
            });
            return res.returncode;
        });
        console.log("clang -target bpf returned:", result2);
        
        await page.close();
        browser.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
})();
