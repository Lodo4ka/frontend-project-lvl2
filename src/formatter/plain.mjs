export default (diffInfo, source1, source2) => {
  const replacer = ' ';
  const spaceCount = 2;
  const elemeIndent = replacer.repeat(spaceCount);
  const lines = diffInfo.reduce((acc, [key, { status }]) => {
    if (status === 'added') {
      return [...acc, `${elemeIndent}+ ${key}: ${source2[key]}`];
    }
    if (status === 'deleted') {
      return [...acc, `${elemeIndent}- ${key}: ${source1[key]}`];
    }
    if (status === 'changed') {
      return [...acc, `${elemeIndent}- ${key}: ${source1[key]}`, `${elemeIndent}+ ${key}: ${source2[key]}`];
    }
    return [...acc, `${elemeIndent}  ${key}: ${source1[key]}`];
  }, []);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
