import {
  union, has, isObject, get, keys,
} from 'lodash-es';

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

export default generateAstDiff;
