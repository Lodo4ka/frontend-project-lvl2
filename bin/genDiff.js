#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from '../src/diff.js';

const program = new Command();

program
  .version('0.0.1', '-v, --vers', 'output the current version')
  .arguments('<filePath1> <filePath2>')
  .option('-f, --format [type]', 'output format, values: stylish, plain, json', 'stylish')
  .action((filePath1, filePath2) => {
    const result = genDiff(filePath1, filePath2, program.opts().format);
    console.log(result);
  })
  .parse(process.argv)
  .opts();
