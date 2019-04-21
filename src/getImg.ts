import * as fs from 'fs';
import Axios from 'axios';
import {Album} from './Album';
const json: Album[][] = require('../hoge.json');
if (!fs.existsSync('./img')) {
  fs.mkdirSync('./img');
}
// 画像保存処理
json.forEach(d => {
  d.forEach(async j => {
    const res = await Axios.get(j.url, { responseType: 'arraybuffer' });
    const bf = Buffer.from(res.data);
    fs.writeFileSync(`./img/${j.name}.jpg`, Buffer.from(res.data), 'binary');
  });
});
