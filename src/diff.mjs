import {
  union, isEqual, has, isObject, get, sortBy, uniqBy,
} from 'lodash-es';

export default (source1, source2) => {
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

  return sortByKey(ast);
};
