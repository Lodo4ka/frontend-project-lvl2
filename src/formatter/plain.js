import {
  isObject, has, isString, compact,
} from 'lodash-es';

const getValue = (arg) => {
  if (isObject(arg)) {
    return '[complex value]';
  }
  if (isString(arg)) {
    return `'${arg}'`;
  }
  return arg;
};

export default (diff) => {
  const isNestedNode = (children) => isObject(children) && has(children[0], 'key');

  const plainNestedLines = (arg, parent) => compact(
    arg
      .flatMap(({ key, status, value }) => {
        const currentKey = [...parent, key].join('.');

        if (status === 'added') {
          return `Property '${currentKey}' was added with value: ${getValue(value)}`;
        }
        if (status === 'deleted') {
          return `Property '${currentKey}' was removed`;
        }
        if (status === 'changed') {
          return `Property '${currentKey}' was updated. From ${getValue(value.oldValue)} to ${getValue(value.newValue)}`;
        }
        if (isNestedNode(value)) { return plainNestedLines(value, [...parent, key]); }
        return null;
      }),
  );
  const lines = plainNestedLines(diff, []);
  return lines.join('\n');
};
