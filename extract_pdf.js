/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('영어과_교육과정(2022개정).pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(function (error) {
    console.log("Error: " + error);
});
