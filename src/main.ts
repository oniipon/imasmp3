import * as puppeteer from "puppeteer";
import * as fs from "fs";
import Axios from "axios";
import { NavigationOptions, EmulateOptions } from "puppeteer";
const getURLs = () => {};
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const b_option: Partial<EmulateOptions> = {
    viewport: {
      width: 1920,
      height: 1080
    },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36"
  };
  await page.emulate(b_option);
  const goto_option: Partial<NavigationOptions> = {
    timeout: 0,
    waitUntil: "networkidle0"
  };
  const test_url = "https://www.google.co.jp/";
  const imas_url = "http://columbia.jp/idolmaster/";
  await page.goto(imas_url, goto_option);
  const images: string[] = await page.evaluate(() => {
    const imageList = document.querySelectorAll("img");
    return Array.from(imageList).map(d => d.src);
  });
  const hoge: string[] = await page.evaluate(
    (d): string[] => {
      const discographyContent = document.querySelector("#discographyContent");
      console.log(discographyContent);
      if (discographyContent === null) return;
      const 一覧dom: HTMLDivElement[] = <any>(
        Array.from(discographyContent.children).filter(
          d =>
            <HTMLHeadingElement>d.children[0] !== undefined &&
            (<HTMLHeadingElement>d.children[0]).innerText.includes(
              "THE IDOLM@STER CINDERELLA"
            )
        )
      );
      const aaaaa = 一覧dom.map(d =>
        Array.from(d.children[1].children).map(
          li_data => (<HTMLLinkElement>li_data.children[0]).href
        )
      );
      const flat_urls: string[] = (<any>aaaaa).flat(1);
      const from_array = Array.from(new Set(flat_urls));
      return from_array.filter(d => !d.includes("#"));
    }
  );
  // const res = await Axios.get(images[10], { responseType: 'arraybuffer' })
  // fs.writeFileSync('./hoge.png', new Buffer(res.data), 'binary')
  //await browser.close();
})();
