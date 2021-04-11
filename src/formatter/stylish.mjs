import {
  sortBy, isEmpty, get,
} from 'lodash-es';

export default (diffInfo, source1, source2) => {
  const replacer = ' ';
  const spaceCount = 2;
  const hasChildren = (children) => !isEmpty(children);

  const sortCustom = (obj) => sortBy(Object.entries(obj), ([key]) => key)
    .map(([key, val]) => (hasChildren(val.children)
      ? [key, { ...val, children: sortCustom(val.children) }] : [key, val]));
  const sortDiffInfo = sortCustom(diffInfo);
  const createStylishLines = (diff, depth, parent) => diff
    .reduce((acc, [key, { status, children }]) => {
      const currentKey = [...parent, key].join('.');
      const indentSize = depth * spaceCount;
      const elemeIndent = replacer.repeat((indentSize));
      const bracketIndent = replacer.repeat(indentSize - spaceCount);

      const drawLeaf = (symbol, keyNode, pathKey, node, indent) => [`${indent.element}${symbol} ${keyNode}: ${get(node, pathKey)}`];
      const drawChildren = (childrenNode, symbol, keyNode, pathKey, depthNode, indent) => [
        `${indent.element}${symbol} ${keyNode}: {`,
        ...createStylishLines(childrenNode, depthNode + 1,
          pathKey.split('.')), `${indent.bracket}}`,
      ];
      const drawNode = ({
        childrenNode, symbol, keyNode, pathKey, node, indent, depthNode,
      }) => (
        hasChildren(childrenNode)
          ? drawChildren(childrenNode, symbol, keyNode, pathKey, depthNode, indent)
          : drawLeaf(symbol, keyNode, pathKey, node, indent)
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
            childrenNode: children, symbol: '+', keyNode: key, pathKey: currentKey, node: source2, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
          }),
          ...drawNode({
            childrenNode: children, symbol: '-', keyNode: key, pathKey: currentKey, node: source1, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
          })];
      }
      return [...acc,
        ...drawNode({
          childrenNode: children, symbol: ' ', keyNode: key, pathKey: currentKey, node: source1, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
        })];
    }, []);
  const lines = createStylishLines(sortDiffInfo, 2, []);
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};
