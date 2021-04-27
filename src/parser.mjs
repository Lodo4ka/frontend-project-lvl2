import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import diff from './diff.mjs';
import jsonParser from './parsers/json-parser.mjs';
import ymlParser from './parsers/yml-parser.mjs';
import stylish from './formatter/stylish.mjs';
import plain from './formatter/plain.mjs';
import common from './formatter/common.mjs';

export default () => {
  const program = new Command();

  program
    .version('0.0.1', '-v, --vers', 'output the current version')
    .arguments('<source1> <source2>')
    .option('-f, --format [type]', 'output format', 'stylish')
    .action((source1, source2) => {
      const opts = program.opts();
      const formatStylish = opts.format;
      const path1 = path.resolve(source1);
      const path2 = path.resolve(source2);
      const format = path.extname(source2);
      const data1 = fs.readFileSync(path1, { encoding: 'utf8', flag: 'r' });
      const data2 = fs.readFileSync(path2, { encoding: 'utf8', flag: 'r' });
      let parse;
      if (format === '.yml') {
        parse = ymlParser;
      } else if (format === '.json') {
        parse = jsonParser;
      }
      const [serData1, serData2] = parse(data1, data2);
      const diffInfo = diff(serData1, serData2);
      if (formatStylish === 'stylish') {
        console.log(stylish(diffInfo));
      }
      if (formatStylish === 'plain') {
        console.log(plain(diffInfo));
      } else {
        console.log(common(diffInfo));
      }
    })
    .parse(process.argv)
    .opts();
};
