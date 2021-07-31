import fs from 'fs';
import path from 'path';

import generateDiffTree from './generateDiffTree.js';
import parse from './parsers.js';
import format from './formatters/index.js';

const getFileFormat = (pathName) => {
  const formatName = path.extname(pathName);
  const extName = formatName.match(/([^.]+)/g);
  return extName;
};

const parseFile = (filePath) => {
  const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  const formatFile = getFileFormat(filePath);
  return parse(data, formatFile);
};

export default function generateDiff(filePath1, filePath2, formatterType = 'stylish') {
  const pathName1 = path.resolve(filePath1);
  const pathName2 = path.resolve(filePath2);
  const source1 = parseFile(pathName1);
  const source2 = parseFile(pathName2);
  const diff = generateDiffTree(source1, source2);
  return format(diff, formatterType);
}
