import {
  union, isEqual, has, isObject, get,
} from 'lodash-es';

export default (source1, source2) => {
  if (isEqual(source1, source2)) {
    return source2;
  }
  const keyValues1 = Object.entries(source1);
  const keyValues2 = Object.entries(source2);
  const unionKeyValues = union(keyValues1, keyValues2);
  const generateDiffInfo = (values, parent) => {
    const result = values.reduce((acc, [key, value]) => {
      const currentKey = [...parent, key].join('.');
      if (isObject(value)) {
        const children = Object.entries(value);
        acc[key] = { ...acc[key], ...generateDiffInfo(children, [...parent, key]) };
      } else if (!has(source1, currentKey)) {
        acc[key] = 'added';
      } else if (!has(source2, currentKey)) {
        acc[key] = 'deleted';
      } else if (get(source1, currentKey) !== get(source2, currentKey)) {
        acc[key] = 'changed';
      } else {
        acc[key] = 'unchanged';
      }
      return acc;
    }, {});
    return result;
  };
  const diffInfo = generateDiffInfo(unionKeyValues, []);
  return { diffInfo, source1, source2 };
};
