import {
  isObject, isString, compact,
} from 'lodash-es';

const renderValue = (arg) => {
  if (isObject(arg)) {
    return '[complex value]';
  }
  if (isString(arg)) {
    return `'${arg}'`;
  }
  return arg;
};

export default (diff) => {
  const plainNestedLines = (arg, parent) => compact(
    arg
      .flatMap(({ key, status, value }) => {
        const currentKey = [...parent, key].join('.');

        if (status === 'added') {
          return `Property '${currentKey}' was added with value: ${renderValue(value)}`;
        }
        if (status === 'deleted') {
          return `Property '${currentKey}' was removed`;
        }
        if (status === 'changed') {
          return `Property '${currentKey}' was updated. From ${renderValue(value.oldValue)} to ${renderValue(value.newValue)}`;
        }
        if (status === 'nested') {
          return plainNestedLines(value, [...parent, key]);
        }
        return null;
      }),
  );
  const lines = plainNestedLines(diff, []);
  return lines.join('\n');
};
