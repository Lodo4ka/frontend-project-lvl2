import { replacer, spaceCount } from '../common/constants.mjs';

export default (diffInfo, source1, source2) => {
  const elemeIndent = replacer.repeat(spaceCount);
  const lines = diffInfo.reduce((acc, [key, { status }]) => {
    if (status === 'added') {
      return [...acc, 'Property key was '];
    }
    if (status === 'deleted') {
      return [...acc, `${elemeIndent}- ${key}: ${source1[key]}`];
    }
    if (status === 'changed') {
      return [...acc, `${elemeIndent}- ${key}: ${source1[key]}`, `${elemeIndent}+ ${key}: ${source2[key]}`];
    }
    // const result = `Property '${}common.follow' was added with value:${} false`;
    return [...acc, `${elemeIndent}  ${key}: ${source1[key]}`];
  }, []);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
