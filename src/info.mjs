import { Command } from 'commander';
import * as fs from 'fs';
import path from 'path';
import {
  differenceWith, isEqual, intersectionWith, sortBy,
} from 'lodash-es';

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
    const dataJ1 = JSON.parse(data1);
    const dataJ2 = JSON.parse(data2);
    if (isEqual(dataJ1, dataJ2)) {
      return 'awesome';
    }
    const keyValues1 = Object.entries(dataJ1);
    const keyValues2 = Object.entries(dataJ2);
    const similarity = intersectionWith(keyValues1, keyValues2, isEqual);
    const diff1 = differenceWith(keyValues1, similarity, isEqual);
    const diff2 = differenceWith(keyValues2, similarity, isEqual);
    const diffKeys1 = diff1.map(([diff]) => diff);
    const diffKeys2 = diff2.map(([diff]) => diff);
    const sortData = sortBy([...similarity, ...diff1, ...diff2], ([key]) => key);
    const diffResult = sortData
      .reduce((acc, [key, value]) => {
        if (diffKeys1.includes(key) && diffKeys2.includes(key) && dataJ1[key] !== dataJ2[key]) {
          acc[`- ${key}`] = dataJ1[key];
          acc[`+ ${key}`] = value;
        } else if (diffKeys1.includes(key) && !diffKeys2.includes(key)) {
          acc[`- ${key}`] = dataJ1[key];
        } else if (!diffKeys1.includes(key) && diffKeys2.includes(key)) {
          acc[`+ ${key}`] = value;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});
    return diffResult;
  });

program.parse(process.argv);

program.opts();
