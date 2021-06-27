import { replacer, spaceCount } from '../common/constants.mjs';

export default (diffInfo) => {
  const elemeIndent = replacer.repeat(spaceCount);
  const lines = diffInfo.flatMap(({
    key, status, value,
  }) => {
    if (status === 'added') {
      return `${elemeIndent}+ ${key}: ${value}`;
    }
    if (status === 'deleted') {
      return `${elemeIndent}- ${key}: ${value}`;
    }
    if (status === 'changed') {
      return [`${elemeIndent}- ${key}: ${value.oldValue}`, `${elemeIndent}+ ${key}: ${value.newValue}`];
    }
    return `${elemeIndent}  ${key}: ${value}`;
  });
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
