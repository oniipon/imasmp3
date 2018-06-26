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
    const start_time = new Date();
    await page.goto('http://columbia.jp/idolmaster/', goto_option);
    const end_time = new Date();
    console.log(`レンダリング完了なう ${Date.parse(end_time.toString()) - Date.parse(start_time.toString())}`);
    // // 検索窓に「puppeteer github」と入力
    // await page.type('#lst-ib', 'puppeteer github');
    // // 検索ボタンクリック
    // await page.focus('input[name="btnK"]');
    // await page.click('input[name="btnK"]');
    // // 遷移完了を待機
    // await page.waitForNavigation();
    // // 検索結果の先頭リンクをクリック
    // await page.click('.rc > .r > a');
    // // ページタイトルを表示
    // const title = await page.title();
    // スクリーンショット
    await page.screenshot({ path: './ss.png' });
    await browser.close();
})();
//# sourceMappingURL=main.js.map