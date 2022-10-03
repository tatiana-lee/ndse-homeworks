#!/usr/bin/env node
const readline = require('readline/promises');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path')

const argv = yargs(hideBin(process.argv)).parse();

if (!argv._[0]) {
  console.log('Введите название игры');
  return;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const randomNumber = Math.floor(1 + Math.random() * 2);

const logFileName = argv._[0];

const filePath = path.join(__dirname, '/gamelogs', `${logFileName}.txt`)


if (fs.existsSync(filePath)) {
  fs.writeFile(filePath, '0', function (err) {
    if (err) throw err;
  });
} else {
  if (!fs.existsSync(path.join(__dirname, '/gamelogs'))) {
    fs.mkdir('gamelogs', (err) => {
      if (err) throw err
    })
  }
  fs.appendFile(filePath, '0', function (err) {
    if (err) throw err;
  });
}

async function game() {
  console.log(
    'Орел или решка? Введите "1" если ваш ответ "орел", или "2" если ваш ответ "решка"'
  );
  let chances = 3;
  while (chances) {
    const answer = await rl.question('Ваш ответ: ');
    if (Number(answer) === randomNumber) {
      console.log(`Верно! Осталось попыток: ${chances - 1}`);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;
        data = Number(data) + 1;
        fs.writeFile(filePath, data.toString(), function (err) {
          if (err) throw err;
        });
      });
    } else {
      console.log(`Увы... Осталось попыток: ${chances - 1}`);
    }

    chances -= 1;
  }

  if (chances === 0) {
    console.log('Игра окончена. Попробуйте заново');
  }

  rl.close();
}

game();
