import fs from 'fs';
import path from 'path';

import generateTreeDiff from './generateTreeDiff.js';
import parse from './parsers.js';
import format from './formatters/index.js';

const parseFile = (filePath) => {
  const getFormatFile = (pathName) => {
    const formatName = path.extname(pathName);
    const extName = formatName.match(/([^.]+)/g);
    return extName;
  };

  const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  const formatFile = getFormatFile(filePath);
  return parse(data, formatFile);
};

export default (filePath1, filePath2, choisesFormatter = 'stylish') => {
  const pathName1 = path.resolve(filePath1);
  const pathName2 = path.resolve(filePath2);
  const source1 = parseFile(pathName1);
  const source2 = parseFile(pathName2);
  const diff = generateTreeDiff(source1, source2);
  return format(diff, choisesFormatter);
};
