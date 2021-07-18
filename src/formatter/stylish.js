import {
  isObject,
} from 'lodash-es';

const replacer = ' ';
const spaceCount = 2;
const renderSpaces = (depth) => replacer.repeat(depth * spaceCount);

const renderValue = (value, depth) => {
  if (!isObject(value)) {
    return value;
  }
  const representation = Object.entries(value)
    .map(
      ([keyNode, valueNode]) => `${renderSpaces(depth + 1)}${keyNode}: ${renderValue(valueNode, depth + 2)}`,
    );
  return [
    '{',
    ...representation,
    `${renderSpaces(depth - 1)}}`,
  ].join('\n');
};

export default (diff) => {
  const createStylishLines = (arg, depth) => arg.flatMap(({ key, status, value }) => {
    if (status === 'nested') {
      return [`${renderSpaces(depth)}  ${key}: {`, ...createStylishLines(value, depth + 2), `${renderSpaces(depth + 1)}}`];
    }
    if (status === 'added') {
      return [`${renderSpaces(depth)}+ ${key}: ${renderValue(value, depth + 2)}`];
    }
    if (status === 'deleted') {
      return [`${renderSpaces(depth)}- ${key}: ${renderValue(value, depth + 2)}`];
    }
    if (status === 'changed') {
      return [
        `${renderSpaces(depth)}- ${key}: ${renderValue(value.oldValue, depth + 2)}`,
        `${renderSpaces(depth)}+ ${key}: ${renderValue(value.newValue, depth + 2)}`,
      ];
    }
    return [`${renderSpaces(depth)}  ${key}: ${renderValue(value, depth + 2)}`];
  });
  const lines = createStylishLines(diff, 1);
  return [
    '{',
    ...lines,
    '}',
  ].join('\n');
};
