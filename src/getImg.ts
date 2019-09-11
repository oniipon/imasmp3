import * as fs from 'fs';
import Axios from 'axios';
import {Album} from './Album';
const json: Album[] = require('../Album.json');
if (!fs.existsSync('./img')) {
  fs.mkdirSync('./img');
}
// 画像保存処理
json.forEach(async d => {
    const res = await Axios.get(d.url, { responseType: 'arraybuffer' });
    fs.writeFileSync(`./img/${d.cd_title}.jpg`, Buffer.from(res.data), 'binary');
});
