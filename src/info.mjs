import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import diffJSON from './diffJSON.mjs';

export default () => {
  const program = new Command();

  program
    .version('0.0.1', '-v, --vers', 'output the current version')
    .arguments('<source1> <source2>')
    .option('-f, --format [type]', 'output format')
    .action((source1, source2) => {
      const path1 = path.resolve(source1);
      const path2 = path.resolve(source2);
      const data1 = fs.readFileSync(path1, { encoding: 'utf8', flag: 'r' });
      const data2 = fs.readFileSync(path2, { encoding: 'utf8', flag: 'r' });
      const result = diffJSON(data1, data2);
      console.log(result);
    });

  program.parse(process.argv);

  program.opts();
};
