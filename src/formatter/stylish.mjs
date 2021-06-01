import {
  isObject,
} from 'lodash-es';
import { replacer, spaceCount } from '../common/constants.mjs';

export default (diffInfo) => {
  const createStylishLines = (diff, depth) => diff.flatMap(({ key, status, value }) => {
    const indentSize = depth * spaceCount;
    const elemeIndent = replacer.repeat((indentSize));
    const bracketIndent = replacer.repeat(indentSize + 2);
    const nestedNodeIndent = replacer.repeat(indentSize + 5);

    const getValue = (valueArg) => {
      if (isObject(valueArg)) {
        return Object.entries(valueArg)
          .flatMap(([keyNode, valueNode]) => ['{', `${nestedNodeIndent} ${keyNode}: ${getValue(valueNode)}`, `${bracketIndent}}`])
          .join('\n');
      }
      return valueArg;
    };

    if (status === 'nested') {
      return [`${elemeIndent}  ${key}: {`, ...createStylishLines(value, depth + 2), `${bracketIndent}}`];
    }
    if (status === 'added') {
      return [`${elemeIndent}+ ${key}: ${getValue(value)}`];
    }
    if (status === 'deleted') {
      return [`${elemeIndent}- ${key}: ${getValue(value)}`];
    }
    if (status === 'changed') {
      return [`${elemeIndent}- ${key}: ${getValue(value[0])}`, `${elemeIndent}+ ${key}: ${getValue(value[1])}`];
    }
    return [`${elemeIndent}  ${key}: ${getValue(value)}`];
  });
  const lines = createStylishLines(diffInfo, 1);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
