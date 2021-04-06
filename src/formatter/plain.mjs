import { sortBy } from 'lodash-es';

export default (diffInfo, source1, source2) => {
  const replacer = ' ';
  const spaceCount = 1;
  const sortDiffInfo = Object.fromEntries(sortBy(Object.entries(diffInfo), ([key]) => key));
  const elemeIndent = replacer.repeat(spaceCount);
  const lines = Object.entries(sortDiffInfo).reduce((acc, [key, value]) => {
    if (value === 'added') {
      return [...acc, `${elemeIndent} + ${key}: ${source2[key]}`];
    }
    if (value === 'deleted') {
      return [...acc, `${elemeIndent} - ${key}: ${source1[key]}`];
    }
    if (value === 'changed') {
      return [...acc, `${elemeIndent} - ${key}: ${source1[key]}`, `${elemeIndent} + ${key}: ${source2[key]}`];
    }
    return [...acc, `${elemeIndent.repeat(3)} ${key}: ${source1[key]}`];
  }, []);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
