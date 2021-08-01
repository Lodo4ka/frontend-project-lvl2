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

export default function formatToPlain(diff) {
  const createPlainLines = (arg, parent) => compact(
    arg
      .flatMap(({
        key, status, value, children,
      }) => {
        const currentKey = [...parent, key].join('.');
        const actions = {
          added: () => `Property '${currentKey}' was added with value: ${renderValue(value)}`,
          deleted: () => `Property '${currentKey}' was removed`,
          changed: () => `Property '${currentKey}' was updated. From ${renderValue(value.oldValue)} to ${renderValue(value.newValue)}`,
          nested: () => createPlainLines(children, [...parent, key]),
          unchanged: () => {},
        };
        return actions[status]();
      }),
  );
  const lines = createPlainLines(diff, []);
  return lines.join('\n');
}
