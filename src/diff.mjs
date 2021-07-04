import fs from 'fs';

import astDiff from './astDiff.js';
import getExtensionName from './getExtensionName.js';
import getParser from './parsers/index.js';
import getFormatter from './formatter/index.js';

export default (path1, path2, choisesFormatter = 'stylish') => {
  const data1 = fs.readFileSync(path1, { encoding: 'utf8', flag: 'r' });
  const data2 = fs.readFileSync(path2, { encoding: 'utf8', flag: 'r' });
  const extName = getExtensionName(path1);
  const parse = getParser(extName);
  const [source1, source2] = parse(data1, data2);
  const ast = astDiff(source1, source2);
  const formatter = getFormatter(choisesFormatter);
  return formatter(ast);
};
