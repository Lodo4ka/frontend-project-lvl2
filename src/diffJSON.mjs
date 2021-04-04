import {
  differenceWith, intersectionWith, isEqual, sortBy,
} from 'lodash-es';

export default (source1, source2) => {
  const dataJ1 = JSON.parse(source1);
  const dataJ2 = JSON.parse(source2);
  if (isEqual(dataJ1, dataJ2)) {
    return dataJ2;
  }
  const keyValues1 = Object.entries(dataJ1);
  const keyValues2 = Object.entries(dataJ2);
  const similarity = intersectionWith(keyValues1, keyValues2, isEqual);
  const diff1 = differenceWith(keyValues1, similarity, isEqual);
  const diff2 = differenceWith(keyValues2, similarity, isEqual);
  const diffKeys1 = diff1.map(([diff]) => diff);
  const diffKeys2 = diff2.map(([diff]) => diff);
  const sortData = sortBy([...similarity, ...diff1, ...diff2], ([key]) => key);
  return sortData
    .reduce((acc, [key, value]) => {
      if (diffKeys1.includes(key) && diffKeys2.includes(key) && dataJ1[key] !== dataJ2[key]) {
        acc[`- ${key}`] = dataJ1[key];
        acc[`+ ${key}`] = value;
      } else if (diffKeys1.includes(key) && !diffKeys2.includes(key)) {
        acc[`- ${key}`] = dataJ1[key];
      } else if (!diffKeys1.includes(key) && diffKeys2.includes(key)) {
        acc[`+ ${key}`] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
};
