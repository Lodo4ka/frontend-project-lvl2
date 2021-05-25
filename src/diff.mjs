import fs from 'fs';
import path from 'path';
import {
  union, isEqual, has, isObject, get, sortBy, uniqBy,
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

  if (isEqual(source1, source2)) {
    return source2;
  }
  const keyValues1 = Object.entries(source1);
  const keyValues2 = Object.entries(source2);
  const unionKeyValues = union(keyValues1, keyValues2);

  const setUniqueByKey = (collection) => uniqBy(collection, (item) => (has(item, 'key') ? item.key : item));

  const sortByKey = (collection) => sortBy(collection, (item) => (has(item, 'key') && item.key))
    .map((item) => (isObject(item) ? ({
      ...item,
      value: Array.isArray(item.value)
        ? sortByKey(item.value) : item.value,
    }) : item));

  const generateAstDiff = (ast) => {
    const iter = (astIter, parent) => astIter.map(([key, value]) => {
      const currentKey = [...parent, key].join('.');
      const getValue = (source, currentKeyArg) => {
        if (isObject(value)) {
          const childrenNode = Object.entries(value);
          return iter(childrenNode, [...parent, key]);
        }
        return get(source, currentKeyArg);
      };
      if (!has(source1, currentKey)) {
        return {
          key,
          status: 'added',
          value: getValue(source2, currentKey),
        };
      } if (!has(source2, currentKey)) {
        return {
          key,
          status: 'deleted',
          value: getValue(source1, currentKey),
        };
      } if (get(source1, currentKey) !== get(source2, currentKey)
          && !isObject(value)) {
        return {
          key,
          status: 'changed',
          value: [getValue(source1, currentKey), getValue(source2, currentKey)],
        };
      }
      return {
        key,
        status: 'unchanged',
        value: getValue(source1, currentKey),
      };
    });

    const treeAst = iter(ast, []);

    const accumulateDiff = () => {
      const innerDiff = treeAst.reduce((acc, elem) => {
        const [findElem] = acc.filter((a) => a.key === elem.key);
        return findElem
          ? acc.map((a) => (a.key === findElem.key
            && isObject(elem.value)
            ? {
              ...a,
              value: setUniqueByKey([...elem.value, ...a.value]),
            } : a))
          : [...acc, elem];
      },
      []);
      return setUniqueByKey(innerDiff);
    };

    return accumulateDiff(treeAst);
  };

  const ast = generateAstDiff(unionKeyValues);

  const sortAst = sortByKey(ast);
  if (choisesFormatter === 'stylish') {
    return stylishFormatter(sortAst);
  }
  if (choisesFormatter === 'plain') {
    return plainFormatter(sortAst);
  }
  if (choisesFormatter === 'json') {
    return jsonFormatter(sortAst);
  }
  return commonFormatter(sortAst);
};
