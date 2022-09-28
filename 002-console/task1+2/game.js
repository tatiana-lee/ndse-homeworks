#!/usr/bin/env node
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });
const randomNumber = Math.floor(Math.random() * 10);
console.log('Загадано число от 0 до 20');
let chances = 5;
while (chances) {
  const answer = await rl.question('Ваш ответ: ');
  if (Number(answer) > randomNumber) {
    console.log(`Меньше. Осталось попыток: ${chances - 1}`);
  } else if (Number(answer) < randomNumber) {
    console.log(`Больше. Осталось попыток: ${chances - 1}`);
  } else {
    console.log(`Ура! Отгадано число: ${answer}`);
    break;
  }
  chances -= 1;
}

if (chances === 0) {
  console.log('Ты проиграл... Попробуй заново');
}

rl.close();
