#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const request = require('request');
const retry = require('promise-retry');
const yargs = require('yargs');

Number.prototype.pad = function (size) {
  let s = `${this}`;
  while (s.length < (size || 2)) {
    s = `0${s}`;
  }
  return s;
};

const {
  url = 'https://serebii.net/sunmoon/pokemon', start = 1, end = 809, pad = false, format = 'png', output = '.'
} = yargs
  .scriptName('scoopr')
  .command(
    '$0 <url> [start] [end] [pad] [format] [output]',
    'scoop some files over HTTP',
    yargs => {
      yargs
        .positional('url', {
          describe: 'URL to fetch content from',
          type: 'string',
          default: 'https://serebii.net/sunmoon/pokemon'
        })
        .positional('start', {
          describe: 'number to begin from',
          type: 'number',
          default: 1
        })
        .positional('end', {
          describe: 'number to end at',
          type: 'number',
          default: 809
        })
        .positional('pad', {
          describe: 'whether to add leading zeros to output files',
          type: 'boolean',
          default: false
        })
        .positional('format', {
          describe: 'format of files to scoop',
          type: 'string',
          default: 'png'
        })
        .positional('output', {
          describe: 'directory to save files to',
          type: 'string',
          default: '.'
        });
    }
  )
  .help().argv;

const PAD_LENGTH = `${end}`.length;

const getUrl = number => `${url}/${number.pad(PAD_LENGTH)}.${format}`;
const getFile = fileUrl =>
  new Promise((resolve, reject) => {
    request(fileUrl, {
      encoding: 'binary'
    }, (error, _, body) => {
      if (error) {
        reject(error);
      }
      resolve(body);
    });
  });

if (!fs.existsSync(output)) {
  fs.mkdirSync(output);
}

const requestArray = [];

for (let i = start; i <= end; i++) {
  const url = getUrl(i);
  const outputPath = path.join(output, `${pad === true ? i.pad(PAD_LENGTH) : i}.${format}`);
  requestArray.push({
    url,
    outputPath
  });
}

requestArray.reduce((promises, req) => {
  return promises.then(() =>
    retry((tryAgain, attemptNo) =>
      getFile(req.url).catch(error => {
        console.error(`Attempt ${attemptNo} for ${req.url} failed; trying again...`);
        return tryAgain(error);
      })
    )
    .then(file => fs.writeFile(req.outputPath, file, 'binary', err => console.error(err)))
    .catch(error => console.error(`ERROR DOWNLOADING FILE: ${req.url}\n`, error))
  );
}, Promise.resolve());