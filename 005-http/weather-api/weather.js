#!/usr/bin/env node
const { APIKey } = require('./config.js');
const http = require('http');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).parse();
const url = `http://api.weatherstack.com/current?access_key=${APIKey}&query=`;
const city = argv._[0];

const req = http.get(url + city, (res) => {
  const { statusCode } = res;
  if (statusCode !== 200) {
    console.error(`Status Code: ${statusCode}`);
    return;
  }
  res.setEncoding('utf-8');
  let rawData = '';
  res.on('data', (chunk) => (rawData += chunk));
  res.on('end', () => {
    console.log(
      `Current temperature in ${JSON.parse(rawData).location.name} is ${
        JSON.parse(rawData).current.temperature
      }℃ , ${JSON.parse(rawData).current['weather_descriptions']}`
    );
  });
});

req.on('error', (err) => {
  console.log(`Error: ${err.message}`);
});
