import {
  differenceWith, intersectionWith, isEqual, sortBy,
} from 'lodash-es';

export default (source1, source2) => {
  if (isEqual(source1, source2)) {
    return source2;
  }
  const keyValues1 = Object.entries(source1);
  const keyValues2 = Object.entries(source2);
  const similarity = intersectionWith(keyValues1, keyValues2, isEqual);
  const diff1 = differenceWith(keyValues1, similarity, isEqual);
  const diff2 = differenceWith(keyValues2, similarity, isEqual);
  const diffKeys1 = diff1.map(([diff]) => diff);
  const diffKeys2 = diff2.map(([diff]) => diff);
  const sortData = sortBy([...similarity, ...diff1, ...diff2], ([key]) => key);
  return sortData
    .reduce((acc, [key, value]) => {
      if (diffKeys1.includes(key) && diffKeys2.includes(key) && source1[key] !== source2[key]) {
        acc[`- ${key}`] = source1[key];
        acc[`+ ${key}`] = value;
      } else if (diffKeys1.includes(key) && !diffKeys2.includes(key)) {
        acc[`- ${key}`] = source1[key];
      } else if (!diffKeys1.includes(key) && diffKeys2.includes(key)) {
        acc[`+ ${key}`] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
};
