import {
  union, has, isObject, get, keys, sortBy, isEqual,
} from 'lodash-es';

const generateDiffTree = (obj1, obj2) => {
  const unionKeys = union(keys(obj1), keys(obj2));
  return sortBy(unionKeys).map((key) => {
    if (isObject(get(obj1, key)) && isObject(get(obj2, key))) {
      return {
        key,
        status: 'nested',
        children: generateDiffTree(get(obj1, key), get(obj2, key)),
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
    if (!isEqual(get(obj1, key), get(obj2, key))) {
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

export default generateDiffTree;
