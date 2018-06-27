"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const b_option = {
        viewport: {
            width: 1920,
            height: 1080,
        },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    };
    page.emulate(b_option);
    const goto_option = {
        timeout: 0,
        waitUntil: 'networkidle0'
    };
    const test_url = 'https://www.google.co.jp/';
    const imas_url = 'http://columbia.jp/idolmaster/';
    await page.goto(imas_url, goto_option);
    const images = await page.evaluate(() => {
        const imageList = document.querySelectorAll('img');
        return Array.from(imageList).map(d => d.src);
    });
    await page.evaluate(d => {
        const discographyContent = document.querySelector('#discographyContent');
        console.log(discographyContent);
        if (discographyContent === null)
            return;
        const 一覧dom = Array.from(discographyContent.children)
            .filter(d => d.children[0] !== undefined)
            .filter(d => d.children[0].innerText.indexOf('THE IDOLM@STER CINDERELLA') === 0);
    });
    // const res = await Axios.get(images[10], { responseType: 'arraybuffer' })
    // fs.writeFileSync('./hoge.png', new Buffer(res.data), 'binary')
    //await browser.close();
})();
//# sourceMappingURL=main.js.map