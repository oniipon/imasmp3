import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { NavigationOptions, EmulateOptions } from 'puppeteer';
import { Album, Artist } from './Album';

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
  const array: Album[][] = [];
  for (const url of hoge) {
    array.push(await getImgUrl(url, page));
  }
  fs.writeFileSync(
    './Album.json',
    JSON.stringify(array.reduce((acc, val) => acc.concat(val), []).filter(d => !d.artist.character[0].includes('error')))
  );
  await browser.close();
  console.log('画像URLの取得に成功しました');
})();

async function getImgUrl(url: string, page: puppeteer.Page): Promise<Album[]> {
  await page.goto(url);
  return await page.evaluate((url: string) => {
    const cinderellas = document.querySelectorAll('.cinderella');
    const cinderella = document.querySelector('#cinderella');
    const discInfo = document.querySelector('.discIndex') ? document.querySelectorAll('.discIndex') : document.querySelector('#discIndex');
    if (cinderellas.length !== 0) {
      return Array.from(cinderellas).map(
        (element, i): Album => {
          const cd_titles = element.querySelector('h2').innerText.split('\n');
          const cd_title = cd_titles[cd_titles.length - 1];
          const cd_series = cd_titles.length === 3 ? cd_titles[0] + ' ' + cd_titles[1] : cd_titles[0];
          const full_title = element.querySelector('h2').innerText;
          try {
            var hoge = discInfo[i]
              .querySelector('dd')
              .innerText.split(/[／\n、]/)
              .map(d => d.replace('(', '（').split('（CV')[0])
              .filter(d => d !== '');
            var fuga = discInfo[i]
              .querySelector('dd')
              .innerText.split(/[／\n、]/)
              .map(d => {
                return d
                  .replace('(', '（')
                  .split('（CV')[1]
                  .replace('）', '')
                  .replace(')', '')
                  .replace(':', '');
              })
              .filter(d => d !== '');
          } catch (error) {
            hoge = discInfo ? [`error${url}`] : ['error ' + discInfo[i].querySelector('dd').innerText];
            fuga = discInfo ? [`error${url}`] : ['error ' + discInfo[i].querySelector('dd').innerText];
          }
          return {
            origin_url: url,
            cd_title: cd_title,
            series: cd_series,
            full_title: full_title,
            artist: {
              character: hoge,
              voice: fuga
            },
            url: element.querySelector('img').src
          };
        }
      );
    } else if (cinderella) {
      const img: HTMLImageElement = document.querySelector('#container > div.movieJ > img');
      const cd_titles = cinderella.querySelector('h2').innerText.split('\n');
      const cd_title = cd_titles[cd_titles.length - 1];
      const cd_series = cd_titles.length === 3 ? cd_titles[0] + ' ' + cd_titles[1] : cd_titles[0];
      const full_title = cinderella.querySelector('h2').innerText;
      let hoge = [];
      let fuga = [];
      try {
        hoge = (discInfo as Element)
          .querySelector('dd')
          .innerText.split(/[／\n、]/)
          .map(d => d.replace('(', '（').split('（CV')[0])
          .filter(d => d !== '');
        fuga = (discInfo as Element)
          .querySelector('dd')
          .innerText.split(/[／\n、]/)
          .map(d => {
            return d
              .replace('(', '（')
              .split('（CV')[1]
              .replace('）', '')
              .replace(')', '')
              .replace(':', '');
          })
          .filter(d => d !== '');
      } catch (error) {
        hoge = discInfo ? [`error${url}`] : ['error ' + (discInfo as Element).querySelector('dd').innerText];
        fuga = discInfo ? [`error${url}`] : ['error ' + (discInfo as Element).querySelector('dd').innerText];
      }
      return [
        {
          origin_url: url,
          cd_title: cd_title,
          series: cd_series,
          full_title: full_title,
          artist: {
            character: hoge,
            voice: fuga
          },
          url: img ? img.src : (cinderella.children[1].children[0] as HTMLImageElement).src
        }
      ];
    }
  }, url);
}
