import * as mm from 'music-metadata';
import * as fs from 'fs';
const BASE_FILE_PATH =
  '/Users/oniipon/Music/iTunes/iTunes Media/Music/Compilations/THE IDOLM@STER CINDERELLA GIRLS LITTLE STARS!　いとしーさー❤/01 いとしーさー❤.m4a';
const IMG_PATH =
  '/Users/oniipon/Music/iTunes/iTunes Media/Music/島村卯月 (CV_ 大橋彩香), 小日向美穂 (CV_ 津田美波) & 五十嵐響子 (CV_ 種﨑敦美)/Palette (M@STER VERSION) - Single/01 Palette (M@STER VERSION).m4a';
const img = '';
const tulip = '/Users/oniipon/Music/iTunes/iTunes Media/Music/Compilations/THE IDOLM@STER CINDERELLA MASTER 恋が咲く季節/03 Tulip.m4a';
(async () => {
  const hoge = await mm.parseFile(`${IMG_PATH}`);
  fs.writeFileSync('tulip.json', JSON.stringify(hoge));
  // hoge.common.picture[0];
})();
