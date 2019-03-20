import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import Axios from 'axios';
import { NavigationOptions, EmulateOptions } from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: false });
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
  const test_url = 'https://www.google.co.jp/';
  const imas_url = 'http://columbia.jp/idolmaster/';
  await page.goto(imas_url, goto_option);
  const images: string[] = await page.evaluate(() => {
    const imageList = document.querySelectorAll('img');
    return Array.from(imageList).map(d => d.src);
  });
  const hoge: string[] = await page.evaluate(
    (): string[] => {
      const discographyContent = document.querySelector('#discographyContent');
      console.log(discographyContent);
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
  // const piyo = await getImgUrl('https://columbia.jp/idolmaster/COCC-17334.html', page);
  // await browser.close();
  const array: Jacket[][] = [];
  for (const url of hoge) {
    array.push(await getImgUrl(url, page));
    console.log('takeshi');
  }
  console.log('mkn');
  console.log(hoge.length);
  fs.writeFileSync('./hoge.json', JSON.stringify(array));
  await browser.close();
})();

async function getImgUrl(url: string, page: puppeteer.Page): Promise<Jacket[]> {
  await page.goto(url);
  return await page.evaluate(() => {
    const cinderellas = document.querySelectorAll('.cinderella');
    return Array.from(cinderellas).map(element => {
      return {
        name: document.querySelector('#cinderella')
          ? (element.children[0].children[0] as HTMLTableSectionElement).innerText
          : (element.children[0].children[1] as HTMLTableSectionElement).innerText,
        url: (element.children[1].children[0] as HTMLImageElement).src,
        origin_url: url,
        selector: getSelectorFromElement(element.children[0].children[0])
      };
    });
  });
}

async function getImgUrlByCinderellaMasterSolo() {}

/**
 * 指定された要素と同一階層、同名の要素コレクション内におけるインデックスを取得します。
 *
 * @param {Element} el   要素。
 * @param {String}  name 要素名。
 *
 * @return {Number} インデックス。範囲は 1 〜 N となります。
 */
function getSiblingElemetsIndex(el: Element, name: string) {
  var index = 1;
  var sib = el;

  while ((sib = sib.previousElementSibling)) {
    if (sib.nodeName.toLowerCase() === name) {
      ++index;
    }
  }

  return index;
}

/**
 * 指定された要素を示すセレクターを取得します。
 *
 * @see http://stackoverflow.com/questions/3620116/get-css-path-from-dom-element
 *
 * @param {Element} el 要素。
 *
 * @return {Array} セレクター名コレクション。
 */
function getSelectorFromElement(el: Element) {
  var names = [];
  if (!(el instanceof Element)) {
    return names;
  }

  while (el.nodeType === Node.ELEMENT_NODE) {
    var name = el.nodeName.toLowerCase();
    if (el.id) {
      // id はページ内で一意となるため、これ以上の検索は不要
      name += '#' + el.id;
      names.unshift(name);
      break;
    }

    // 同じ階層に同名要素が複数ある場合は識別のためインデックスを付与する
    // 複数要素の先頭 ( index = 1 ) の場合、インデックスは省略可能
    //
    var index = getSiblingElemetsIndex(el, name);
    if (1 < index) {
      name += ':nth-of-type(' + index + ')';
    }

    names.unshift(name);
    (el as any) = el.parentNode;
  }

  return names;
}
