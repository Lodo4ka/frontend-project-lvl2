import fs from 'fs';
import path from 'path';
import {
  union, has, isObject, get, keys,
} from 'lodash-es';
import jsonParser from './parsers/json-parser.mjs';
import ymlParser from './parsers/yml-parser.mjs';
import stylishFormatter from './formatter/stylish.mjs';
import plainFormatter from './formatter/plain.mjs';
import commonFormatter from './formatter/common.mjs';
import jsonFormatter from './formatter/json.mjs';

export default (path1, path2, choisesFormatter = 'stylish') => {
  const data1 = fs.readFileSync(path1, { encoding: 'utf8', flag: 'r' });
  const data2 = fs.readFileSync(path2, { encoding: 'utf8', flag: 'r' });

  const format = path.extname(path1);
  let parse;
  if (format === '.yml') {
    parse = ymlParser;
  } else if (format === '.json') {
    parse = jsonParser;
  }
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

  const mapFormatted = {
    stylish: (astArg) => stylishFormatter(astArg),
    plain: (astArg) => plainFormatter(astArg),
    json: (astArg) => jsonFormatter(astArg),
  };

  return mapFormatted[choisesFormatter](ast);
};
