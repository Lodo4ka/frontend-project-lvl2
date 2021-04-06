import {
  sortBy, isObject, get,
} from 'lodash-es';

export default (diffInfo, source1, source2) => {
  const replacer = ' ';
  const spaceCount = 2;
  const sortCustom = (obj) => sortBy(Object.entries(obj), ([key]) => key)
    .map(([key, val]) => (isObject(val) ? [key, sortCustom(val)] : [key, val]));
  const sortDiffInfo = sortCustom(diffInfo);
  const createStylishLines = (diff, depth, parent) => diff.reduce((acc, [key, value]) => {
    const currentKey = [...parent, key].join('.');
    const indentSize = depth * spaceCount;
    const elemeIndent = replacer.repeat((indentSize));
    const bracketIndent = replacer.repeat(indentSize - spaceCount);
    if (Array.isArray(value)) {
      return [...acc, `${elemeIndent}${key}: {`,
        ...createStylishLines(value, depth + 1,
          [...parent, key]), `${bracketIndent}}`];
    }
    if (value === 'added') {
      return [...acc, `${elemeIndent}+ ${key}: ${get(source2, currentKey)}`];
    }
    if (value === 'deleted') {
      return [...acc, `${elemeIndent}- ${key}: ${get(source1, currentKey)}`];
    }
    if (value === 'changed') {
      return [...acc, `${elemeIndent}- ${key}: ${get(source1, currentKey)}`, `${elemeIndent}+ ${key}: ${get(source2, currentKey)}`];
    }
    return [...acc, `${elemeIndent}  ${key}: ${get(source1, currentKey)}`];
  }, []);
  const lines = createStylishLines(sortDiffInfo, 2, []);
  console.log('lines', lines);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
