import fs from 'fs';

import generateAstDiff from './generateAstDiff.js';
import getFormatFile from './getFormatFile.js';
import parse from './parsers/index.js';
import format from './formatters/index.js';

const parseFile = (path) => {
  const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
  const formatFile = getFormatFile(path);
  return parse(data, formatFile);
};

export default (path1, path2, choisesFormatter = 'stylish') => {
  const source1 = parseFile(path1);
  const source2 = parseFile(path2);
  const diff = generateAstDiff(source1, source2);
  return format(diff, choisesFormatter);
};
