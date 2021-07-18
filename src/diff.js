import fs from 'fs';

import astDiff from './generateAstDiff.js';
import getExtensionName from './getExtensionName.js';
import getParser from './parsers/index.js';
import getFormatter from './formatter/index.js';

const getParsedData = (path) => {
  const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
  const extName = getExtensionName(path);
  const parse = getParser(extName);
  const parsedData = parse(data);
  return parsedData;
};

export default (path1, path2, choisesFormatter = 'stylish') => {
  const source1 = getParsedData(path1);
  const source2 = getParsedData(path2);
  const ast = astDiff(source1, source2);
  const formatter = getFormatter(choisesFormatter);
  return formatter(ast);
};
