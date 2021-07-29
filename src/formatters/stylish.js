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
  const createStylishLines = (arg, depth) => arg.flatMap(({
    key, status, value, children,
  }) => {
    const actions = {
      nested: () => [`${renderSpaces(depth)}  ${key}: {`, ...createStylishLines(children, depth + 2), `${renderSpaces(depth + 1)}}`],
      added: () => [`${renderSpaces(depth)}+ ${key}: ${renderValue(value, depth + 2)}`],
      deleted: () => [`${renderSpaces(depth)}- ${key}: ${renderValue(value, depth + 2)}`],
      changed: () => [
        `${renderSpaces(depth)}- ${key}: ${renderValue(value.oldValue, depth + 2)}`,
        `${renderSpaces(depth)}+ ${key}: ${renderValue(value.newValue, depth + 2)}`,
      ],
      unchanged: () => [`${renderSpaces(depth)}  ${key}: ${renderValue(value, depth + 2)}`],
    };
    return actions[status]();
  });
  const lines = createStylishLines(diff, 1);
  return [
    '{',
    ...lines,
    '}',
  ].join('\n');
};
