import {
  isEmpty, get, isObject, isUndefined,
} from 'lodash-es';

export default (diffInfo, source1, source2) => {
  const replacer = ' ';
  const spaceCount = 2;
  const hasChildren = (children) => !isEmpty(children);
  const createStylishLines = (diff, depth, parent) => diff
    .reduce((acc, [key, { status, children }]) => {
      const currentKey = [...parent, key].join('.');
      const indentSize = depth * spaceCount;
      const elemeIndent = replacer.repeat((indentSize));
      const bracketIndent = replacer.repeat(indentSize + 2);
      const drawChildren = (childrenNode, symbol, keyNode, pathKey, depthNode, indent) => [
        `${indent.element}${symbol} ${keyNode}: {`,
        ...createStylishLines(childrenNode, depthNode + 2, pathKey.split('.')),
        `${indent.bracket}}`,
      ];

      const drawLeaf = (symbol, keyNode, pathKey, node, depthNode, indent) => {
        const val = get(node, pathKey);
        return isObject(val)
          ? drawChildren(Object.entries(val), symbol, keyNode, pathKey, depthNode, indent)
          : [`${indent.element}${symbol} ${keyNode}:${get(node, pathKey) !== '' ? `${` ${get(node, pathKey)}`}` : ''}`];
      };

      const drawNode = ({
        childrenNode, symbol, keyNode, pathKey, node, indent, depthNode,
      }) => (
        hasChildren(childrenNode)
          ? drawChildren(childrenNode, symbol, keyNode, pathKey, depthNode, indent)
          : drawLeaf(symbol, keyNode, pathKey, node, depthNode, indent)
      );
      if (status === 'added') {
        return [...acc,
          ...drawNode({
            childrenNode: children, symbol: '+', keyNode: key, pathKey: currentKey, node: source2, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
          })];
      } if (status === 'deleted') {
        return [...acc,
          ...drawNode({
            childrenNode: children, symbol: '-', keyNode: key, pathKey: currentKey, node: source1, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
          })];
      } if (status === 'changed') {
        return [...acc,
          ...drawNode({
            childrenNode: children, symbol: '-', keyNode: key, pathKey: currentKey, node: source1, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
          }),
          ...drawNode({
            childrenNode: children, symbol: '+', keyNode: key, pathKey: currentKey, node: source2, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
          })];
      }
      return [...acc,
        ...drawNode({
          childrenNode: children, symbol: ' ', keyNode: key, pathKey: currentKey, node: isUndefined(get(source1, currentKey)) ? source2 : source1, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
        })];
    }, []);
  const lines = createStylishLines(diffInfo, 1, []);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
