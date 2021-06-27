import {
  isObject,
} from 'lodash-es';
import { replacer, spaceCount } from '../common/constants.mjs';

const renderSpaces = (depth) => replacer.repeat(depth * spaceCount);

const getValue = (value, depth) => {
  if (!isObject(value)) {
    return value;
  }
  const representation = Object.entries(value)
    .map(
      ([keyNode, valueNode]) => `${renderSpaces(depth + 1)}${keyNode}: ${getValue(valueNode, depth + 2)}`,
    );
  return [
    '{',
    ...representation,
    `${renderSpaces(depth - 1)}}`,
  ].join('\n');
};

export default (diffInfo) => {
  const createStylishLines = (diff, depth) => diff.flatMap(({ key, status, value }) => {
    if (status === 'nested') {
      return [`${renderSpaces(depth)}  ${key}: {`, ...createStylishLines(value, depth + 2), `${renderSpaces(depth + 1)}}`];
    }
    if (status === 'added') {
      return [`${renderSpaces(depth)}+ ${key}: ${`${getValue(value, depth + 2)}`}`];
    }
    if (status === 'deleted') {
      return [`${renderSpaces(depth)}- ${key}: ${`${getValue(value, depth + 2)}`}`];
    }
    if (status === 'changed') {
      return [
        `${renderSpaces(depth)}- ${key}: ${`${getValue(value.oldValue, depth + 2)}`}`,
        `${renderSpaces(depth)}+ ${key}: ${`${getValue(value.newValue, depth + 2)}`}`,
      ];
    }
    return [`${renderSpaces(depth)}  ${key}: ${`${getValue(value, depth + 2)}`}`];
  });
  const lines = createStylishLines(diffInfo, 1);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
