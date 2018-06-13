"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
const URL = 'http://columbia.jp/idolmaster/';
(async () => {
    const b = await puppeteer.launch();
    const p = await b.newPage();
    const b_options = {
        viewport: {
            width: 1024,
            height: 600,
        },
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    };
    await p.emulate(b_options);
    await p.goto(URL);
    const ss_options = {
        path: '../',
        type: "png",
    };
    await p.screenshot(ss_options);
})();
