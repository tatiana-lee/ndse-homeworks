#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path')

const argv = yargs(hideBin(process.argv)).parse();

const gameName = !argv._[0] ? 'Введите игру' : argv._[0];
if (!argv._[0]) {
  console.log(gameName);
  return;
}

const filePath = path.join(__dirname, '/gamelogs', `${gameName}.txt`)

const analyze = yargs(hideBin(process.argv))
  .command({
    command: gameName,
    describe: 'Analyze the game',
    handler() {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            console.log('Нет такой игры');
            return;
          }
          throw err;
        }
        const win = Number(data);
        const lost = 3 - win;
        const winPercent = Math.round((win * 100) / 3);

        console.log(`Количество партий: ${3}
Выиграно: ${win} / Проиграно: ${lost}
Процент выигранных партий: ${winPercent}%`);
      });
    },
  })
  .parse();
