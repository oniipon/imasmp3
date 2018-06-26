import * as puppeteer from 'puppeteer';
import * as fs from 'fs'
import Axios from 'axios'
import { NavigationOptions, EmulateOptions } from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const b_option: Partial<EmulateOptions> = {
    viewport: {
      width: 1920,
      height: 1080,
    },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
  }
  page.emulate(b_option)
  const goto_option: Partial<NavigationOptions> = {
    timeout: 0,
    waitUntil: 'networkidle0'
  }
  const test_url = 'https://www.google.co.jp/'
  const imas_url = 'http://columbia.jp/idolmaster/'
  await page.goto(imas_url, goto_option)
  const images: string[] = await page.evaluate(() => {
    const imageList = document.querySelectorAll('img');
    return Array.from(imageList).map(d => d.src);
  })
  const 一覧dom = await page.evaluate(d => {
    const discographyContent = document.querySelector('#discographyContent')
    console.log(discographyContent)
    if (discographyContent === null) return
    return Array.from(discographyContent.children)
      .filter(d => (<HTMLHeadingElement>d.children[0]) !== undefined)
      .filter(d => (<HTMLHeadingElement>d.children[0]).innerText.indexOf('THE IDOLM@STER CINDERELLA GIRLS'))
      .map(d => (<HTMLHeadingElement>d.children[0]).innerText)
  })
  console.log(一覧dom)
  // const res = await Axios.get(images[10], { responseType: 'arraybuffer' })
  // fs.writeFileSync('./hoge.png', new Buffer(res.data), 'binary')
  //await browser.close();
})();

