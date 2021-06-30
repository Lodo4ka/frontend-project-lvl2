import fs from 'fs';
import {
  union, has, isObject, get, keys,
} from 'lodash-es';
import getParsers from './parsers/index.js';
import getFormatter from './formatter/index.js';

export default (path1, path2, choisesFormatter = 'stylish') => {
  const data1 = fs.readFileSync(path1, { encoding: 'utf8', flag: 'r' });
  const data2 = fs.readFileSync(path2, { encoding: 'utf8', flag: 'r' });
  const parse = getParsers(path1);
  const [source1, source2] = parse(data1, data2);

  const generateAstDiff = (obj1, obj2) => {
    const unionKeys = union(keys(obj1), keys(obj2));
    return unionKeys.sort().map((key) => {
      if (isObject(get(obj1, key)) && isObject(get(obj2, key))) {
        return {
          key,
          status: 'nested',
          value: generateAstDiff(get(obj1, key), get(obj2, key)),
        };
      }
      if (!has(obj1, key)) {
        return {
          key,
          status: 'added',
          value: get(obj2, key),
        };
      }
      if (!has(obj2, key)) {
        return {
          key,
          status: 'deleted',
          value: get(obj1, key),
        };
      }
      if (get(obj1, key) !== get(obj2, key)) {
        return {
          key,
          status: 'changed',
          value: { oldValue: get(obj1, key), newValue: get(obj2, key) },
        };
      }
      return {
        key,
        status: 'unchanged',
        value: get(obj1, key),
      };
    });
  };

  const ast = generateAstDiff(source1, source2);
  const formatter = getFormatter(choisesFormatter);
  return formatter(ast);
};
