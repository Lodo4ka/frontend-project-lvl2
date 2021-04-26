import {
  has, isObject, uniq,
} from 'lodash-es';
import { replacer, spaceCount } from '../common/constants.mjs';

export default (diffInfo) => {
  const isNestedNode = (children) => isObject(children) && has(children[0], 'key');

  const childrenHaveSameStatus = (children, parentStatus) => {
    const iter = (childrenArg) => childrenArg
      .flatMap(({ status, value }) => ((isNestedNode(value))
        ? iter(value) : status));
    const statuses = uniq(iter(children, parentStatus));
    return statuses.length === 1 && statuses[0] === parentStatus;
  };

  const setStatusChildren = (childrenArg, status) => childrenArg
    .map((child) => (isNestedNode(child.value)
      ? { ...child, status, value: setStatusChildren(child.value, status) }
      : { ...child, status }));

  const createStylishLines = (diff, depth) => diff.flatMap(({ key, status, value }) => {
    const indentSize = depth * spaceCount;
    const elemeIndent = replacer.repeat((indentSize));
    const bracketIndent = replacer.repeat(indentSize + 1);
    const nestedNodeIndent = replacer.repeat(indentSize + 6);
    const getValue = (valueArg, parentStatus) => {
      if (isNestedNode(valueArg)) {
        const haveSameStatuses = childrenHaveSameStatus(valueArg, parentStatus);
        const children = haveSameStatuses ? setStatusChildren(valueArg, 'unchanged') : valueArg;
        const nestedNode = createStylishLines(children, depth + 2).join('\n');
        return `{\n${nestedNode}\n ${bracketIndent}}`;
      }
      if (isObject(valueArg)) {
        const keyValue = Object.entries(valueArg);
        return `{\n${nestedNodeIndent}${keyValue[0][0]}: ${keyValue[0][1]}\n ${bracketIndent}}`;
      }
      return valueArg;
    };
    if (status === 'added') {
      return `${elemeIndent}+ ${key}: ${getValue(value, status)}`;
    }
    if (status === 'deleted') {
      return `${elemeIndent}- ${key}: ${getValue(value, status)}`;
    }
    if (status === 'changed') {
      return [`${elemeIndent}- ${key}: ${getValue(value[0], status)}`, `${elemeIndent}+ ${key}: ${getValue(value[1], status)}`];
    }
    return `${elemeIndent}  ${key}: ${getValue(value, status)}`;
  });
  const lines = createStylishLines(diffInfo, 1, []);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
