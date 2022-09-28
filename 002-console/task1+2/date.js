#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const today = new Date();

const isoDate = today.toISOString();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();
const time = isoDate.slice(10);

const argvObj = yargs(hideBin(process.argv)).parse();

const argv = yargs(hideBin(process.argv))
  .option('year', {
    alias: 'y',
    describe: 'Show current year',
  })
  .option('month', {
    alias: 'm',
    describe: 'Show current month',
  })
  .option('date', {
    alias: 'd',
    describe: 'Show current date',
  })
  .command({
    command: 'add',
    describe: 'Add smth',
    handler() {
      if (argvObj['d'] || argvObj['date']) {
        const newDay = date + (argvObj['d'] || argvObj['date']);
        const newDate = new Date(year, month - 1, newDay + 1);
        console.log(newDate.toISOString().slice(0, 10) + time);
      }
      if (argvObj['m'] || argvObj['month']) {
        const newMonth = month + (argvObj['m'] || argvObj['month']);
        const newDate = new Date(year, newMonth - 1, date + 1);
        console.log(newDate.toISOString().slice(0, 10) + time);
      }
    },
  })
  .command({
    command: 'sub',
    describe: 'Substract smth',
    handler() {
      if (argvObj['d'] || argvObj['date']) {
        const newDay = date - (argvObj['d'] || argvObj['date']);
        const newDate = new Date(year, month - 1, newDay + 1);
        console.log(newDate.toISOString().slice(0, 10) + time);
      }
      if (argvObj['m'] || argvObj['month']) {
        const newMonth = month - (argvObj['m'] || argvObj['month']);
        const newDate = new Date(year, newMonth - 1, date + 1);
        console.log(newDate.toISOString().slice(0, 10) + time);
      }
    },
  })
  .parse();

if (argv._.length === 0) {
  if (argv.year) {
    console.log(year);
  } else if (argv.month) {
    console.log(month);
  } else if (argv.date) {
    console.log(date);
  } else {
    console.log(isoDate);
  }
}
