import * as puppeteer from 'puppeteer'

const URL= 'http://columbia.jp/idolmaster/';

(async () => {
  const b = await puppeteer.launch();
  const p =await  b.newPage();
  const options = {
    viewport: {
      width: 1024,
      height: 600,
    },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
  };
  await p.emulate(options)
  await p.goto(URL)
})()