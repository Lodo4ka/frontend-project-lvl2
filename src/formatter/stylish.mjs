import {
  get, isObject, isUndefined,
} from 'lodash-es';
import { replacer, spaceCount } from '../common/constants.mjs';
import hasChildren from '../common/utils.mjs';

export default (diffInfo) => {
  console.log('diffInfo', JSON.stringify(diffInfo));
  const lines = [];
  return [
    '{',
    ...lines,
    '}',
    '',
  ].join('\n');
};

// [{
//   key: 'common',
//   status: 'unchanged',
//   value: [{
//     key: 'follow',
//     status: 'added',
//     value: false,
//   }, {
//     key: 'setting1',
//     status: 'unchanged',
//     value: 'Value 1',
//   }, {
//     key: 'setting3',
//     status: 'changed',
//     value: [true, null],
//   }, {
//     key: 'setting4',
//     status: 'added',
//     value: 'blah blah',
//   }, {
//     key: 'setting5',
//     status: 'added',
//     value: [{
//       key: 'key5',
//       status: 'added',
//       value: 'value5',
//     }],
//   }, {
//     key: 'setting6',
//     status: 'unchanged',
//     value: [{
//       key: 'key',
//       status: 'unchanged',
//       value: 'value',
//     }, {
//       key: 'ops',
//       status: 'added',
//       value: 'vops',
//     }, {
//       key: 'doge',
//       status: 'unchanged',
//       value: [{
//         key: 'wow',
//         status: 'changed',
//         value: ['', 'so much'],
//       }],
//     }],
//   }, {
//     key: 'setting2',
//     status: 'deleted',
//     value: 200,
//   }],
// }, {
//   key: 'group1',
//   status: 'unchanged',
//   value: [{
//     key: 'foo',
//     status: 'unchanged',
//     value: 'bar',
//   }, {
//     key: 'baz',
//     status: 'changed',
//     value: ['bas', 'bars'],
//   }, {
//     key: 'nest',
//     status: 'changed',
//     value: [{
//       key: 'value',
//     }, 'str'],
//   }],
// }, {
//   key: 'group2',
//   status: 'deleted',
//   value: [{
//     key: 'abc',
//     status: 'deleted',
//     value: 12345,
//   }, {
//     key: 'deep',
//     status: 'deleted',
//     value: [{
//       key: 'id',
//       status: 'deleted',
//       value: 45,
//     }],
//   }],
// }, {
//   key: 'group3',
//   status: 'added',
//   value: [{
//     key: 'deep',
//     status: 'added',
//     value: [{
//       key: 'id',
//       status: 'added',
//       value: [{
//         key: 'number',
//         status: 'added',
//         value: 45,
//       }],
//     }],
//   }, {
//     key: 'fee',
//     status: 'added',
//     value: 100500,
//   }],
// }];

// const createStylishLines = (diff, depth, parent) => diff
//   .reduce((acc, [key, { status, children }]) => {
//     const currentKey = [...parent, key].join('.');
//     const indentSize = depth * spaceCount;
//     const elemeIndent = replacer.repeat((indentSize));
//     const bracketIndent = replacer.repeat(indentSize + 2);
//     const drawChildren = (childrenNode, symbol, keyNode, pathKey, depthNode, indent) => [
//       `${indent.element}${symbol} ${keyNode}: {`,
//       ...createStylishLines(childrenNode, depthNode + 2, pathKey.split('.')),
//       `${indent.bracket}}`,
//     ];

//     const drawLeaf = (symbol, keyNode, pathKey, node, depthNode, indent) => {
//       const val = get(node, pathKey);
//       return isObject(val)
//         ? drawChildren(Object.entries(val), symbol, keyNode, pathKey, depthNode, indent)
//         : [`${indent.element}${symbol} ${keyNode}:${get(node, pathKey) !== '' ? `${` ${get(node, pathKey)}`}` : ''}`];
//     };

//     const drawNode = ({
//       childrenNode, symbol, keyNode, pathKey, node, indent, depthNode,
//     }) => (
//       hasChildren(childrenNode)
//         ? drawChildren(childrenNode, symbol, keyNode, pathKey, depthNode, indent)
//         : drawLeaf(symbol, keyNode, pathKey, node, depthNode, indent)
//     );
//     if (status === 'added') {
//       return [...acc,
//         ...drawNode({
//           childrenNode: children, symbol: '+', keyNode: key, pathKey: currentKey, node: source2, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
//         })];
//     } if (status === 'deleted') {
//       return [...acc,
//         ...drawNode({
//           childrenNode: children, symbol: '-', keyNode: key, pathKey: currentKey, node: source1, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
//         })];
//     } if (status === 'changed') {
//       return [...acc,
//         ...drawNode({
//           childrenNode: children, symbol: '-', keyNode: key, pathKey: currentKey, node: source1, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
//         }),
//         ...drawNode({
//           childrenNod: children, symbol: '+', keyNode: key, pathKey: currentKey, node: source2, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
//         })];
//     }
//     return [...acc,
//       ...drawNode({
//         childrenNode: children, symbol: ' ', keyNode: key, pathKey: currentKey, node: isUndefined(get(source1, currentKey)) ? source2 : source1, indent: { element: elemeIndent, bracket: bracketIndent }, depthNode: depth,
//       })];
// }, []);
// const lines = createStylishLines(diffInfo, 1, []);
