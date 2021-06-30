#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import diff from '../src/diff.mjs';

const program = new Command();

program
  .version('0.0.1', '-v, --vers', 'output the current version')
  .arguments('<source1> <source2>')
  .option('-f, --format [type]', 'output format, values: stylish, plain, json', 'stylish')
  .action((source1, source2) => {
    const opts = program.opts();
    const choisesFormatter = opts.format;
    const path1 = path.resolve(source1);
    const path2 = path.resolve(source2);
    const result = diff(path1, path2, choisesFormatter);
    console.log(result);
  })
  .parse(process.argv)
  .opts();
