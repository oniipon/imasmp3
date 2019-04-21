import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { NavigationOptions, EmulateOptions } from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const b_option: Partial<EmulateOptions> = {
    viewport: {
      width: 1920,
      height: 1080
    },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
  };
  await page.emulate(b_option);
  const goto_option: Partial<NavigationOptions> = {
    timeout: 0,
    waitUntil: 'networkidle0'
  };
  const imas_url = 'http://columbia.jp/idolmaster/';
  await page.goto(imas_url, goto_option);
  const hoge: string[] = await page.evaluate(
    (): string[] => {
      const discographyContent = document.querySelector('#discographyContent');
      if (discographyContent === null) return;
      const 一覧dom: HTMLDivElement[] = Array.from(discographyContent.children).filter(
        d =>
          <HTMLHeadingElement>d.children[0] !== undefined &&
          (<HTMLHeadingElement>d.children[0]).innerText.includes('THE IDOLM@STER CINDERELLA')
      ) as HTMLDivElement[];
      const aaaaa = 一覧dom.map(d => Array.from(d.children[1].children).map(li_data => (<HTMLLinkElement>li_data.children[0]).href));
      const flat_urls: string[] = (<any>aaaaa).flat(1);
      const from_array = Array.from(new Set(flat_urls));
      return from_array.filter(d => !d.includes('#'));
    }
  );
  const array: Jacket[][] = [];
  for (const url of hoge) {
    array.push(await getImgUrl(url, page));
  }
  fs.writeFileSync('./hoge.json', JSON.stringify(array));
  await browser.close();
  console.log('画像URLの取得に成功しました');
})();

async function getImgUrl(url: string, page: puppeteer.Page): Promise<Jacket[]> {
  await page.goto(url);
  return await page.evaluate((url: string) => {
    const cinderellas = document.querySelectorAll('.cinderella');
    const cinderella = document.querySelector('#cinderella');
    if (cinderellas.length !== 0) {
      return Array.from(cinderellas).map(element => {
        return {
          origin_url: url,
          name: document.querySelector('#cinderella')
            ? (element.children[0].children[0] as HTMLTableSectionElement).innerText
            : (element.children[0].children[1] as HTMLTableSectionElement).innerText,
          url: element.querySelector('img').src
          //HTMLAnchorElement
        };
      });
    } else if (cinderella) {
      const img: HTMLImageElement = document.querySelector('#container > div.movieJ > img');
      return [
        {
          origin_url: url,
          name: (cinderella.children[0].children[1] as HTMLTableSectionElement).innerText,
          url: img ? img.src : (cinderella.children[1].children[0] as HTMLImageElement).src
        }
      ];
    }
  }, url);
}
