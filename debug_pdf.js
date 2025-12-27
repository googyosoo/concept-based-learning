/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const pdf = require('pdf-parse');

const filename = '영어과_교육과정(2022개정).pdf';

if (fs.existsSync(filename)) {
    console.log(`File ${filename} found.`);
    const dataBuffer = fs.readFileSync(filename);
    pdf(dataBuffer).then(function (data) {
        // limit output to avoid buffer overflow if it works
        console.log(data.text);
    }).catch(function (error) {
        console.error("PDF Parse Error:", error);
    });
} else {
    console.error(`File ${filename} NOT found.`);
}
